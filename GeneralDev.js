// Generated by LiveScript 1.3.1
(function(){
  var path, delimit, _, fs, SeperateFilesAndDir, chokidar, Cc, ErrorC, SuccessC, FileNameC, Config, Public, Find, Watch, Struct, DeleteOnExit, DoWork, BuildScript, SetConfig;
  path = require('path');
  delimit = path.sep;
  _ = require("prelude-ls");
  fs = require("GetRidOfError")(
  require("fs"));
  SeperateFilesAndDir = require("SeparateFilesAndDirectories").SeperateFilesAndDir;
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
    var RegEx, i$, len$, I, Anly;
    RegEx = new RegExp("(.*)." + Config.InitialExt);
    for (i$ = 0, len$ = Files.length; i$ < len$; ++i$) {
      I = Files[i$];
      Anly = RegEx.exec(I);
      if (Anly) {
        yield Anly[1];
      }
    }
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
  DeleteOnExit = function(FileName){
    return process.on("SIGINT", function(){
      var FileString;
      FileString = FileName + "." + Config.FinalExtention;
      fsa.unlink(FileString, function(err){
        if (err) {
          throw err;
        }
        Struct.Count = Struct.Count + 1;
        console.error(SuccessC("Successfully removed " + FileNameC(FileString)));
        if (Struct.Count === Config.Count) {
          process.exit();
        }
      });
    });
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
  BuildScript = function(InitialCompile, SetUpWatch, DeleteCompiledFileOnExit){
    var WorkFn;
    InitialCompile == null && (InitialCompile = true);
    SetUpWatch == null && (SetUpWatch = true);
    DeleteCompiledFileOnExit == null && (DeleteCompiledFileOnExit = false);
    WorkFn = function(arg$){
      var Files;
      Files = arg$.Files;
      return DoWork(InitialCompile, SetUpWatch, DeleteCompiledFileOnExit, Files);
    };
    return SeperateFilesAndDir(Config.DirToLook, WorkFn);
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
