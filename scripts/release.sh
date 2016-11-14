#!/bin/sh

DATES=$(export TZ=UTC; date '+%Y-%m-%dT%H%M%SZ %Y%m%d.%H%M%S.0 %Y-%m-%dT%H:%M:%SZ')
DATE_STD=$(echo $DATES | awk '{ print $1; }')
DATE_SEMVER=$(echo $DATES | awk '{ print $2; }')
DATE_ISO8601=$(echo $DATES | awk '{ print $3; }')


sed -i "s/\"version\": \".*\"/\"version\": \"$DATE_SEMVER\"/" package.json
sed -i "s/\"standard\": \".*\"/\"standard\": \"$DATE_STD\"/" package.json

git add package.json
git commit --date=$DATE_ISO8601 -m 'Version bump'
$(export GIT_COMMITTER_DATE=$DATE_ISO8601; git tag -a -m "Version $DATE_STD" $DATE_STD)