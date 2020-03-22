-install python (2.7 or higher)
-place python.exe in windows path: go to python installation then in command prompt:
	set path=%PATH%;%CD%
	setx path "%PATH%"
-put convert_obj_three.py in folder where .obj model + associated textures are located
-go to object's folder using command prompt
-compile in command:
	python convert_obj_three.py -i myobject.obj -o myoutput.js

;abz;20120130