# OONI Probe for IoT

**WARNING** this is not ready for production just yet.

This repo is about getting ooniprobe to run on hardware devices.

Maybe one day all this tooling will be part of the Desktop user interface, to
make it easier for users to just burn a pre-configured image and pop it into
their IoT device.

## Getting OONI Probe on ResinOS

**1. Get the base image**

Get the base image from one of the links below:

* https://files.resin.io/resinos/raspberry-pi/2.2.0%2Brev1.dev/image/resin.img.zip (RPi 1 and RPi Zero)
* https://files.resin.io/resinos/raspberrypi3/2.3.0%2Brev1.dev/image/resin.img.zip (RPi 2)
* https://files.resin.io/resinos/raspberry-pi2/2.2.0%2Brev1.dev/image/resin.img.zip (RPi 3)

You can also try out the experimental CLI that will guide you through the
process of downloading the image you need:

```
node cli.js download
```

**2. Install resin-cli**

Then from the your terminal do (assuming you put the image in this directory):

```
npm install --global --production resin-cli
```

**3. Configure the image**

By configuring the image you can get it to connect automatically to your WiFi
network when it boots up. Even if you don't decide to do this, it's still
required to have the `ooniprobe.local` hostname.

```
unzip resin.img.zip
sudo resin local configure ./resin.img
```

You will be prompted to answer some questions. Here are the answers you should
provide:

```
? Network SSID YOUR_WIFI_SSID
? Network Key YOUR_WIFI_PASSWORD
? Do you want to set advanced settings? Yes
? Device Hostname ooniprobe
? Do you want to enable persistent logging? No
```

**4. Flash the image**

Pop an SD card into your SD card writer slot and run:

```
sudo resin local flash ./resin.img
```

**5. We have liftoff**

Unmount the SD card and power on your device.

After a while you should see something called `ooniprobe.local` advertised via
mdns.

At this point you can SSH into the host without any password (that's quite scary
actually, see TODO), via:
```
ssh root@ooniprobe.local -p22222
```

**6. Install OONI Probe**

Edit `./Dockerfile` and comment out the line for the device you want to
support if needed.

Then push OONI Probe to the device by running:

```
sudo resin local push ooniprobe.local --source images/raspberry-pi3/
```

If you are running on a slow raspberry pi, this may take a while.

**7. Happy probing!**

You should then be able to access the ooniprobe web interface by opening
http://ooniprobe.local in a web browser.

### TODO

These are things that must be done to consider this somewhat "stable":

* Disable passwordless, keyless, root ssh login

* Upgrade dropbear client to latest version and maybe replace it with openssh
  (dropbear is full of security holes). See:
  https://github.com/resin-os/meta-resin/issues/858

* Re-configure openvpn to connect to our own VPN instead of vpn.resin.io (see:
  https://github.com/resin-os/meta-resin/issues/800)

* Build base images of all the target hardware platforms with OONI Probe
  already on it and the above improvements

### IDEAs

These are cool ideas that I am not yet 100% sure are good ideas

#### BLE configuration

Support configuring the device via BLE in particular setting the wifi network password. This could work that on first start the device is in an inactive state. You click on a hardware button on the device and send it some QR code to prove you are close to it (the QR maybe have on it something like the mac address or some ID that is stored in the hardware of the device). When initialised some other metadata in the QR code is also stored so now only people that know the QR code can further modify the device. Via BLE you can configure the wifi password, tell it to update and maybe
install additional software.  This should be done inside of the dom0 of the
host (outside of docker).

#### Auto update

Add support for OONI Probe docker container auto-update.

Maybe if we have BLE configuration we don't actually need auto-update as it can
be handle inside of the app (like most IoT things do it anyways).

