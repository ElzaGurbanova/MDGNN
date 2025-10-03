#!/usr/bin/env node
import chalk from 'chalk';
import columns from 'cli-columns';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import util from 'util';
import assertNpmAuthorization from '../utils/assertnpmauthorization.js';
import { execFile } from 'child_process';

const execFilePromise = util.promisify(execFile);

export default async function reassignNpmTags( { npmOwner, version, packages } ) {
  const errors = [];
  const packagesSkipped = [];
  const packagesUpdated = [];

  await assertNpmAuthorization( npmOwner );

  const counter = tools.createSpinner( 'Reassigning npm tags...', { total: packages.length } );
  counter.start();

  const updateTagPromises = packages.map( async packageName => {
    // Basic guards to avoid option-like args
    if (!packageName || packageName.startsWith('-') || !version || String(version).startsWith('-')) {
      errors.push(`Invalid package or version: ${packageName}@${version}`);
      counter.increase();
      return;
    }

    const run = () => execFilePromise('npm', ['dist-tag', 'add', `${packageName}@${version}`, 'latest']);

    const updateLatestTagRetryable = retry(run);
    await updateLatestTagRetryable()
      .then( response => {
        const stdout = response.stdout || '';
        const stderr = response.stderr || '';
        if (stdout) {
          packagesUpdated.push( packageName );
        } else if (stderr) {
          throw new Error( stderr );
        }
      } )
      .catch( error => {
        if (String(error.message).includes('is already set to version')) {
          packagesSkipped.push( packageName );
        } else {
          errors.push( trimErrorMessage( error.message ) );
        }
      } )
      .finally( () => {
        counter.increase();
      } );
  } );

  await Promise.allSettled( updateTagPromises );

  counter.finish();

  if ( packagesUpdated.length ) {
    console.log( chalk.bold.green( '✨ Tags updated:' ) );
    console.log( columns( packagesUpdated ) );
  }

  if ( packagesSkipped.length ) {
    console.log( chalk.bold.yellow( '⬇️ Packages skipped:' ) );
    console.log( columns( packagesSkipped ) );
  }

  if ( errors.length ) {
    console.log( chalk.bold.red( '🐛 Errors found:' ) );
    errors.forEach( msg => console.log( `* ${ msg }` ) );
  }
}

function trimErrorMessage( message ) {
  return message.replace( /npm ERR!.*\n/g, '' ).trim();
}

function retry( callback, times = 3 ) {
  return ( ...args ) => Promise.resolve()
    .then( () => callback( ...args ) )
    .catch( err => {
      if ( times > 0 ) {
        return retry( callback, times - 1 )( ...args );
      }
      throw err;
    } );
}

