#!/usr/bin/env sh

export CXX=g++-5

# install dependencies
sudo apt-get install -y --force-yes unzip
sudo apt-get install -y --force-yes build-essential
sudo apt-get install -y --force-yes cmake
sudo apt-get install -y --force-yes libgtk2.0-dev
sudo apt-get install -y --force-yes pkg-config
sudo apt-get install -y --force-yes python-numpy python-dev
sudo apt-get install -y --force-yes libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install -y --force-yes libjpeg-dev libpng-dev libtiff-dev libjasper-dev
sudo apt-get install -y --force-yes -qq libopencv-dev build-essential checkinstall cmake pkg-config yasm libjpeg-dev libjasper-dev libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev libxine-dev libgstreamer0.10-dev libgstreamer-plugins-base0.10-dev libv4l-dev python-dev python-numpy libtbb-dev libqt4-dev libgtk2.0-dev libmp3lame-dev libopencore-amrnb-dev libopencore-amrwb-dev libtheora-dev libvorbis-dev libxvidcore-dev x264 v4l-utils

# download opencv-2.4.13
wget https://github.com/Itseez/opencv/archive/2.4.13.zip
unzip 2.4.13.zip
cd opencv-2.4.13
mkdir release
cd release

# compile and install
cmake -G "Unix Makefiles" \
  -D CMAKE_CXX_COMPILER=/usr/bin/g++ CMAKE_C_COMPILER=/usr/bin/gcc \
  -D CMAKE_BUILD_TYPE=RELEASE \
  -D CMAKE_INSTALL_PREFIX=/usr/local \
  -D ENABLE_FAST_MATH=ON \
  -D BUILD_SHARED_LIBS=OFF \
  -D WITH_GSTREAMER=ON ..
make all -j4 # 4 cores
sudo make install
