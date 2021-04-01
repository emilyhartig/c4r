{
	'targets':
	[
		{
			'target_name': 'c4r',
			'cflags_cc': ['-std=c++17', '-O3', '-DNDEBUG'],
			'sources': ['cpp/Solver.cpp', 'cpp/native_addon.cpp'],
		}
	]
}
