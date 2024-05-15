@echo off
set "label=USBVKS"
:a
::-------V----Change this to your drive Letter
if exist - %label%:\ (goto Yes) else (goto a)

:Yes
::V----Change this to your drive Letter
for /f "usebackq tokens=2 delims==" %%G in (`wmic logicaldisk where "drivetype=2 and volumename='%label%'" get caption /value`) do (
    set "usbName=%%G"
)
::----V----You can put any Program you want here
start %usbName%\File.bat
goto end

:end