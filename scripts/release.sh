#!/bin/sh

DATES=$(export TZ=UTC; date '+%Y-%m-%dT%H%M%SZ %Y%m%d.%H%M%S.0 %Y-%m-%dT%H:%M:%SZ')
DATE_STD=$(echo $DATES | awk '{ print $1; }')
DATE_SEMVER=$(echo $DATES | awk '{ print $2; }')
DATE_ISO8601=$(echo $DATES | awk '{ print $3; }')


sed -i "s/\"version\": \".*\"/\"version\": \"$DATE_SEMVER\"/" package.json

sed -i "s/\"semver\": \".*\"/\"semver\": \"$DATE_SEMVER\"/" release.json
sed -i "s/\"standard\": \".*\"/\"standard\": \"$DATE_STD\"/" release.json
sed -i "s/\"fullISO8601\": \".*\"/\"fullISO8601\": \"$DATE_ISO8601\"/" release.json

git add package.json release.json
git commit --date=$DATE_ISO8601 -m "Release $DATE_STD"
$(export GIT_COMMITTER_DATE=$DATE_ISO8601; git tag -a -m "Version $DATE_STD" $DATE_STD)