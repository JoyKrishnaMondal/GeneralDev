// Generated by LiveScript 1.4.0
(function(){
  var path, delimit, _, fs, SeparateFilesAndDir, chokidar, Cc, ErrorC, SuccessC, FileNameC, Config, Public, Find, Watch, Struct, DeleteFn, KeepName, CleanFn, DeleteOnExit, DoWork, BuildScript, SetConfig;
  path = require('path');
  delimit = path.sep;
  _ = require("prelude-ls");
  fs = require("GetRidOfError")(
  require("fs"));
  SeparateFilesAndDir = require("SeparateFilesAndDirectories").SeparateFilesAndDir;
  chokidar = require("chokidar");
  Cc = require("cli-color");
  ErrorC = Cc.redBright;
  SuccessC = Cc.greenBright;
  FileNameC = Cc.yellowBright;
  Config = {
    InitialExt: null,
    FinalExtention: null,
    DirToLook: null,
    DirToSave: null,
    Count: 0
  };
  Public = {};
  Find = function*(Files){
    var RegEx, i$, len$, I, Anly, results$ = [];
    RegEx = new RegExp("(.*)." + Config.InitialExt);
    for (i$ = 0, len$ = Files.length; i$ < len$; ++i$) {
      I = Files[i$];
      Anly = RegEx.exec(I);
      if (Anly) {
        results$.push((yield Anly[1]));
      }
    }
    return results$;
  };
  Watch = function(FileName){
    var watcher;
    watcher = chokidar.watch(FileName + "." + Config.InitialExt);
    return watcher.on("change", function(){
      Config.Compile(FileName);
    });
  };
  Struct = {};
  Struct.Count = 0;
  DeleteFn = function(Ob){
    if (Ob.Deleted === true) {
      return;
    } else {
      Ob.Deleted = true;
    }
    Struct.Count += 1;
    console.error(SuccessC("Successfully removed ") + FileNameC(Ob.Name));
  };
  KeepName = function(Ob){
    return function(){
      return DeleteFn(Ob);
    };
  };
  CleanFn = function(FileString){
    var Ob;
    Ob = {};
    Ob.Name = FileString;
    Ob.Deleted = false;
    return function(){
      return fs.unlink(Ob.Name, KeepName(Ob));
    };
  };
  DeleteOnExit = function(FileName){
    var FileString, OnExitFn;
    FileString = FileName + "." + Config.FinalExtention;
    OnExitFn = CleanFn(FileString);
    process.on("exit", OnExitFn);
    return process.on("SIGINT", OnExitFn);
  };
  DoWork = function(CompileFlag, WatchFlag, DeleteFlag, Files){
    var Gen, Go, ref$, value, done;
    Gen = Find(Files);
    Go = true;
    while (Go) {
      ref$ = Gen.next(), value = ref$.value, done = ref$.done;
      if (!done) {
        if (CompileFlag) {
          Config.Compile(value);
        }
        if (WatchFlag) {
          Watch(value);
        }
        if (DeleteFlag) {
          DeleteOnExit(value);
        }
        Config.Count += 1;
      } else {
        Go = false;
      }
    }
  };
  BuildScript = function(InitialCompile, SetUpWatch, DeleteCompiledFileOnExit, DirToSave, DirToLook){
    var WorkFn;
    InitialCompile == null && (InitialCompile = true);
    SetUpWatch == null && (SetUpWatch = true);
    DeleteCompiledFileOnExit == null && (DeleteCompiledFileOnExit = false);
    DirToSave == null && (DirToSave = process.cwd());
    DirToLook == null && (DirToLook = process.cwd());
    WorkFn = function(arg$){
      var Files;
      Files = arg$.Files;
      return DoWork(InitialCompile, SetUpWatch, DeleteCompiledFileOnExit, Files);
    };
    Config.DirToLook = DirToLook;
    Config.DirToSave = DirToSave;
    return SeparateFilesAndDir(Config.DirToLook, WorkFn);
  };
  SetConfig = function(UserConfig){
    var Exit, i$, ref$, len$, I;
    Exit = false;
    if (UserConfig.InitialExt === undefined) {
      console.error(FileNameC("InitialExt" + ErrorC(" is not defined - what is the source file extention ? ")));
      Exit = true;
    }
    if (UserConfig.FinalExtention === undefined) {
      console.error(FileNameC("FinalExtention" + ErrorC(" is not defined - what is the target file extention ? ")));
      Exit = true;
    }
    if (UserConfig.DirToLook === undefined) {
      console.error(FileNameC("DirToLook" + ErrorC(" is not defined - Which Directory is your source file located in ?")));
      Exit = true;
    }
    if (UserConfig.DirToSave === undefined) {
      console.error(FileNameC("DirToSave" + ErrorC(" is not defined - Which Directory is your source file located in ?")));
      Exit = true;
    }
    if (Exit === true) {
      console.error(FileNameC("UserConfig" + ErrorC(" JSON variable for " + FileNameC("SetConfig" + ErrorC(" is not correctly set - please check docs for more help.")))));
      console.error(ErrorC("Terminting Program."));
      return;
    } else {
      for (i$ = 0, len$ = (ref$ = _.keys(UserConfig)).length; i$ < len$; ++i$) {
        I = ref$[i$];
        Config[I] = UserConfig[I];
      }
    }
    return BuildScript;
  };
  Public.SetConfig = SetConfig;
  Public.PrintSucess = function(FileName){
    return console.error(FileNameC((FileName + ".") + Config.InitialExt + SuccessC(" Compiled.")));
  };
  Public.PrintFailure = function(FileName){
    var InitialExt;
    InitialExt = Config.InitialExt;
    return console.error(ErrorC(InitialExt + " Parse failure at ") + FileNameC(FileName + "." + InitialExt));
  };
  module.exports = Public;
}).call(this);
