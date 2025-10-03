var path = require( 'path' );
var url = require( 'url' );
var fs = require( 'fs' );
var cluster = require( 'cluster' );
var child = require( 'child_process' );
var exec = child.exec;
var util = require( 'util' );
var shellescape = require( 'shell-escape' );

var mkdirp = require( 'mkdirp' );
var debug = require( 'debug' )( 'clb-branch' );

function isValidBranchName( branchName ) {
	// .. is forbidden (keep behavior); array-form commands below avoid shell parsing anyway
	return branchName && ! branchName.match( /\.\./ );
}

function Branch( config ) {
	this.repository = config.repository;
	this.destination = config.destination;
	this.name = config.name;
	if( ! isValidBranchName( this.name ) ) {
		throw new Error( 'Invalid branch name' );
	}
}

Branch.prototype.exec = function( command, options, callback ) {
	var branchName = this.name;
	if ( ! callback && typeof options === 'function' ) {
		callback = options;
		options = {};
	}
	options = Object.assign( {
		timeout: 30 * 1000,
		killSignal: 'SIGTERM',
	}, options );

	// If caller provided an array, run it WITHOUT a shell (safe).
	if (Array.isArray(command)) {
		var file = String(command[0]);
		var args = command.slice(1).map(String);
		debug(branchName + ' > ' + [file].concat(args).join(' '));

		// If cwd was provided, make sure it exists (keep prior check)
		if ( options.cwd && ! fs.existsSync( options.cwd ) ) {
			return callback && callback( new Error( 'Branch directory ' + options.cwd + ' does not exist while trying to run: ' + file + ' ' + args.join(' ') ) );
		}

		var childProc = child.execFile(file, args, Object.assign({}, options, { shell: false }), function (err, stdout, stderr) {
			debug( branchName + ' > ' + ( err || (stderr || '').toString() || (stdout || '').toString() ) );
			if (callback) {
				callback(
					err,
					(stdout || '').toString().replace(/\s/gm, ''),
					(stderr || '').toString().replace(/\s/gm, '')
				);
			}
		});
		return childProc;
	}

	// String commands: preserve old behavior (may rely on shell features like ';')
	var escapedCommand = command; // unchanged
	debug( branchName + ' > ' + command );
	if ( options.cwd && ! fs.existsSync( options.cwd ) ) {
		return callback && callback( new Error( 'Branch directory ' + options.cwd + ' does not exist while trying to run: ' + command ) );
	}
	return exec( escapedCommand, options, function( err, stdout, stderr ) {
		debug( branchName + ' > ' + ( err || (stderr || '').toString() || (stdout || '').toString() ) );
		callback && callback( err, (stdout || '').toString().replace( /\s/gm, '' ), (stderr || '').toString().replace( /\s/gm, '' ) );
	} );
};

Branch.prototype.getDirectory = function() {
	return path.join( this.destination, this.name );
};

Branch.prototype.checkout = function( callback, currentProcessUpdate ) {
	var branch = this;
	var branchName = this.name;
	var destinationDir = this.getDirectory();
	var repo = this.repository;
	var currentProcess = null;
	currentProcessUpdate = currentProcessUpdate || function noop() {};
	currentProcess = this.exists( function( err, branchExist ) {
		if ( err || ! branchExist ) {
			return callback( err || new Error( 'Branch not found ' + branchName ) );
		}
		currentProcessUpdate( null );
		fs.stat(destinationDir, function( err ) {
			if ( ! err ) return branch.update(callback);
			mkdirp(destinationDir, function( err ) {
				if ( err ) return callback( err, destinationDir);
				currentProcess = branch.exec( [ 'git', 'clone', repo.getDirectory(), destinationDir ], function( err ) {
					if ( err ) return callback( err, destinationDir );
					currentProcess = branch.exec( [ 'git', 'checkout', branch.name ], {
						cwd: destinationDir
					}, function( err ) {
						currentProcessUpdate( null );
						callback( err, destinationDir );
					} );
					currentProcessUpdate( currentProcess );
				} );
				currentProcessUpdate( currentProcess );
			} );
		} );
	} );
	currentProcessUpdate( currentProcess );
};

Branch.prototype.update = function( callback ) {
	var branch = this;
	// shell features used here; left as string (static)
	return branch.exec( 'git fetch origin; git reset --hard @{u}', {
		cwd: branch.getDirectory()
	}, function( err ) {
		callback( err, branch.getDirectory() );
	} );
};

Branch.prototype.isUpToDate = function(callback) {
	var branch = this;
	// shell features used here; left as string (static)
	return branch.exec( 'git fetch origin > /dev/null; if [ $(git rev-parse @) != $(git rev-parse @{u}) ]; then echo "not up to date"; fi;', {
		cwd: branch.getDirectory()
	}, function( err, stdout ) {
		callback( err, stdout.length === 0 );
	} );
};

Branch.prototype.getLastCommit = function( callback ) {
	var branch = this;
	return branch.exec( 'git rev-parse HEAD', {
		cwd: this.getDirectory()
	}, function( err, stdout ) {
		callback( err, stdout );
	} );
};

Branch.prototype.hasChanged = function( sinceCommit, inDirs, callback ) {
	var branch = this;
	if( ! inDirs || inDirs.length === 0 ) {
		inDirs = [ '.' ];
	}
	return branch.exec( [ 'git', 'diff', '--name-only', sinceCommit+'..HEAD' ].concat( inDirs ), {
		cwd: this.getDirectory()
	}, function( err, stdout ) {
		callback( err, stdout.length > 0 );
	} );
};

Branch.prototype.exists = function( callback ) {
	var branch = this;
	var repo = this.repository;
	return branch.exec( [ 'git', 'ls-remote', repo.getDirectory(), branch.name ], function( err, stdout ) {
		var branchExist = stdout.length > 0;
		callback(err, branchExist);
	} );
};

module.exports = Branch;

