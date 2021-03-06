path = require 'path'

delimit = path.sep

_ = require "prelude-ls"

fs =  (require "fs") |> (require "GetRidOfError")

{SeparateFilesAndDir} = require "SeparateFilesAndDirectories"

chokidar = require "chokidar"

Cc = require "cli-color"

ErrorC = Cc.redBright

SuccessC = Cc.greenBright

FileNameC = Cc.yellowBright

Config =  # Class that has Config Information / Populated Later
	InitialExt:null
	FinalExtention:null
	DirToLook:null
	DirToSave:null
	Count:0 # Number of files we are tracking - its useful since when we want to delete our files
	# We need to know if all the files are deleted. 

Public = {} # Class that will expose the main API functions


Find = (Files) ->*

	RegEx = new RegExp "(.*)\." + Config.InitialExt

	for I in Files

		Anly = RegEx.exec I

		if Anly

			yield Anly[1] # Return ONLY the name of the found file.


Watch = (FileName) ->

	watcher = chokidar.watch FileName + "." + Config.InitialExt

	<-! watcher.on "change"

	Config.Compile FileName

Struct = {}

Struct.Count = 0

DeleteFn = (Ob) ->

	if Ob.Deleted is true
		return
	else
		Ob.Deleted = true

	Struct.Count += 1

	console.error ((SuccessC "Successfully removed ") + (FileNameC Ob.Name))
	# if Struct.Count is Config.Count
	# 	process.pause()

		# setTimeout (-> process.exit!),2000
	

	return

KeepName = (Ob) -> -> DeleteFn Ob

CleanFn = (FileString) -> 
	
	Ob = {}

	Ob.Name = FileString

	Ob.Deleted = false

	-> fs.unlink Ob.Name, (KeepName Ob)

DeleteOnExit = (FileName) ->

	FileString = FileName + "." + Config.FinalExtention
	
	OnExitFn = CleanFn FileString

	process.on "exit",OnExitFn

	process.on "SIGINT",OnExitFn



DoWork = (CompileFlag,WatchFlag,DeleteFlag,Files)->

	Gen = Find Files

	Go = true

	while Go

		{value,done} = Gen.next!


		if not done

			if CompileFlag
				Config.Compile value

			if WatchFlag
				Watch value

			if DeleteFlag
				DeleteOnExit value

			Config.Count += 1

		else

			Go = false

	return

BuildScript = (InitialCompile = true, SetUpWatch = true ,DeleteCompiledFileOnExit = false, DirToSave = process.cwd!, DirToLook = process.cwd!) -> 
	
	WorkFn = ({Files}) -> DoWork InitialCompile,SetUpWatch,DeleteCompiledFileOnExit,Files

	Config.DirToLook = DirToLook

	Config.DirToSave = DirToSave
	
	SeparateFilesAndDir Config.DirToLook,WorkFn

SetConfig = (UserConfig) -> 

	Exit = false
	if UserConfig.InitialExt is undefined
		console.error FileNameC "InitialExt" + ErrorC " is not defined - what is the source file extention ? "
		Exit = true
	if UserConfig.FinalExtention is undefined
		console.error FileNameC "FinalExtention" + ErrorC " is not defined - what is the target file extention ? "
		Exit = true
	if UserConfig.DirToLook is undefined
		console.error FileNameC "DirToLook" + ErrorC " is not defined - Which Directory is your source file located in ?" 
		Exit = true
	if UserConfig.DirToSave is undefined
		console.error FileNameC "DirToSave" + ErrorC " is not defined - Which Directory is your source file located in ?"
		Exit = true

	if Exit is true
		console.error FileNameC "UserConfig" + ErrorC " JSON variable for " + FileNameC "SetConfig"  + ErrorC " is not correctly set - please check docs for more help."
		console.error ErrorC "Terminting Program."
		return

	else

		for I in _.keys UserConfig
			Config[I] = UserConfig[I]

	BuildScript

# SetConfig is the main entry function

Public.SetConfig = SetConfig

# Helper Functions and variables

Public.PrintSucess = (FileName) ->

	console.error FileNameC "#{FileName}." + Config.InitialExt + SuccessC " Compiled."

Public.PrintFailure = (FileName) ->

	{InitialExt} = Config

	console.error (ErrorC InitialExt + " Parse failure at ") + FileNameC FileName + "." + InitialExt

module.exports = Public