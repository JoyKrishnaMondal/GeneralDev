#### GeneralDev - tiny module to handle some general devop tasks


#### Why

All of dev ops tasks can be boiled down to **3** main ones

1. **Compilation**
2. **Watch** and do something on change - mostly **Compilation**
3. **Delete**


For different devop tasks its usually just changing the *way* the compilation happens - maybe its minification or `less` compilation.  Everything else usually stays the same. 

Also the other thing that *may* change is directory - based on if its source, distribution, etc. 

This modules abtracts away the 3 tasks of compilation, watching and deletion. 

The way it works is you define a **compile** function - it could be async/sync - it could involve minification or no-minifcation. The point is that whatever your compilation process is - the basic lower level tasks of watching/deletion/complication hardly ever changes.


So if there is some new language/compiler you want to try out. You could quickly write a compile function based on the API of the language/compiler - and then plug it into this module - which will output a *custom* function that accepts three flag arguments - for the three tasks.

##### How to Use 

We define a config function - for our example we will try to create a less compiler 

```livescript

Config =
	InitialExt:"less"
	FinalExtention:"css"
	DirToLook:process.cwd! # Provides path of current Directory
	DirToSave:process.cwd! # Provides path of current Directory
	Compile:(FileName) ->

		# The compile function gets the fileName for each of your files.
		
		# ----------------------------------------------------------
		# POPULATE ME !
		# The next snippet populates this part for a less compiler
		# ----------------------------------------------------------

		return

```

```livescript

fs = require "fs"

delimit = require "path" | (.sep)

{SetConfig,PrintSucess,PrintFailure,CreatePath} = require "GeneralDev"

Config =
	InitialExt:"less"
	FinalExtention:"css"
	DirToLook:process.cwd! 
	DirToSave:process.cwd! 
	Compile:(FileName) ->

		ReadFilePath = Config.DirToLook + delimit + FileName + + "." + Config.InitialExt

		error,data <-! fs.readFile ReadFilePath,'utf8'

		if error 
			throw error

		(error, output) <-! less.render data

		if error
			throw error

		WriteFilePath = CreatePath FileName,Config.FinalExtention

		ReadFilePath = Config.DirToSave + delimit + FileName + + "." + Config.FinalExtention

		error <-! fs.writeFile WriteFilePath,output.css

		if error
			throw error

AutoBuild = SetConfig Config

module.exports = AutoBuild

```
### How Everything works 

`SetConfig` accepts the `Config` Object and outputs a your customized build function. 

The custom build function accepts three boolean arguments - each specifing the three important task mentioned above

|Argument| Type |Default | Task | 
|----------------|-------------------|-------------------|----|
|1<sup>st<sup>| Boolean | True  | Specifies if all the source files get an intial compilation |
|2<sup>nd<sup>| Boolean | True  | If you would want to setup an watch and compile for each of the files |
|3<sup>rd<sup>| Boolean | False | If you want to do an cleanup when the buildscript exits |



In the above example - we output a build function called `AutoBuild` that when called speficially sets up a `less` compilation with watch and delete in the directory from where its being run - due to using `process.cwd()` - *if* run without any arguments.


hello 
<!-- ```AutoBuild()```
The command below will create watches - but **will not** do an initial compilation or delete any files after compilation. The situation I use this for is I want to make some small changes in a large source directory and and then move those files to a distribution directory.
```AutoBuild(false,true,false)```

Just compile all files. The situation I would use this combination would be when I want to recompile all my sources to distribution but am not doing any developement myself.

```AutoBuild(true,false,false)```

This is an interesting combination - you may think its not useful - but I use it a lot when I need clean up my source directory after experimenting around. 

```AutoBuild(false,false,true)```

As you can see the point is to create a **general** purpose build script, rather than being too specific about one thing. 

### Config Object

| Keys           | Type     | Description                                                                    |
|----------------|----------|--------------------------------------------------------------------------------|
| InitialExt     | String   | This is the expected extension of the source file - for `less` that would be "less". For `coffeescript` that would be "coffee"|
| FinalExtention | String   | What the extension of the the final file should be - css,js,etc               |
| DirToLook      | String   | Specify the Directory where the source Files are located in                   |
| DirToSave      | String   | Specify the Directory where the compiled Files need to be saved in            |
| Compile        | Function | The first argument of this function is the filename of the source file. The fuction will be called whenever one of the files being watched is changed and the name of the file would be passed on as the first argument. |


### Note

I will not be maintaining this module unless people inform me they are using it. 

If you find any error or problems please raise it as an issue.  -->