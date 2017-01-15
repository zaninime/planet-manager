#!/usr/bin/env python3
import datetime
import json
import os
import re
import subprocess
import sys

PROJECT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))

class SanityError(Exception):
    pass

def sanity_check():
    current_branch_proc = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], stdout=subprocess.PIPE)
    current_branch = current_branch_proc.stdout.decode().strip()
    print('Current branch is: {}'.format(current_branch))
    if current_branch != 'master':
        raise SanityError('Cannot create a release on this branch')

    tags_pointing_here_proc = subprocess.run(['git', 'tag', '--points-at', 'HEAD'], stdout=subprocess.PIPE)
    if (len(tags_pointing_here_proc.stdout) > 0):
        tags_pointing_here = tags_pointing_here_proc.stdout.decode().strip().split('\n')
    else:
        tags_pointing_here = []
    regex = r'^v\d+\.\d+\.\d+.*$'
    version_tags = list(filter(lambda x: re.match(regex, x), tags_pointing_here))
    print('Tags pointing to this revision: {}'.format(version_tags))

    if (len(version_tags) > 0):
        raise SanityError('Cannot release on top of another release')

def create_git_revision(version_name):
    now = datetime.datetime.now(datetime.timezone.utc)
    subprocess.call(['git', 'add', 'package.json', 'release.json'])
    subprocess.call(['git', 'commit', '-m', 'Version {}'.format(version_name), '--date', now.isoformat()], stdout=sys.stdout)

    git_tag_env = os.environ.copy()
    git_tag_env['GIT_COMMITTER_DATE'] = now.isoformat()

    subprocess.Popen(['git', 'tag', '-a', '-m', 'Version {}'.format(version_name), 'v{}'.format(version_name)], stdout=sys.stdout)

def update_version_in_files(version_name):
    with open('release.json', 'w') as f:
        json.dump({ 'name': version_name }, f, indent=4)
        f.write('\n')

    with open('package.json') as f:
        package_json = f.read()

    version_re = r'("version"\s*:\s*)"[0-9.]+"'
    package_json = re.sub(version_re, r'\1"{}"'.format(version_name), package_json)

    with open('package.json', 'w') as f:
        f.write(package_json)


def get_current_release_data():
    with open(os.path.join(PROJECT_DIR, 'release.json')) as f:
        release_data = json.load(f)
    return release_data

def calculate_next_version(current_version):
    current_major, current_minor, current_patch = map(int, current_version.split('.'))
    today = datetime.date.today()
    next_major = today.year % 2000
    next_minor = today.month
    if next_major == current_major and next_minor == current_minor:
        return '.'.join(map(str, [current_major, current_minor, current_patch + 1]))
    return '.'.join(map(str, [next_major, next_minor, 0]))

def main():
    print('Running sanity check')
    try:
        sanity_check()
    except SanityError as e:
        print('Checks failed: {}'.format(e))
        sys.exit(1)

    print('Sanity check passed')

    release_data = get_current_release_data()
    print('Current version is: {}'.format(release_data['name']))

    next_version = calculate_next_version(release_data['name'])
    print('Next version will be: {}'.format(next_version))

    answer = input('Proceed? (yes/no): ')
    if answer != 'yes':
        print('Aborted')
        return

    update_version_in_files(next_version)
    create_git_revision(next_version)
    print('Success')

if __name__ == '__main__':
    main()
