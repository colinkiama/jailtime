# jailtime

Blocks Websites. Keeps you focused!

## Task scripts

You run scripts in the `task` directory to perform development tasks e.g running `task/build` copy files to the build directory, ready to be loaded unpacked.

### Give them executable permissions

Run this command first:

```sh
chmod +x task/*
```

That will give permission to all scripts in the `task` directory to run.

### Caveats on Windows operating systems

These scripts are shell scripts (`sh`) however, some of the commands may not be compatible with windows. You may need to install a bash terminal on windows in order to work with these scripts on there.


