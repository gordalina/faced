#!/usr/bin/env sh

rm -fr /usr/local/bin/f2py
rm -fr /usr/local/lib/python2.7/site-packages/numpy/

brew install pkg-config opencv@2
brew link opencv@2 --force
