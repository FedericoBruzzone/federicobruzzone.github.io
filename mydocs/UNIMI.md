# UNIMI


## Connect to VPN

**Config File**

Unimi provides a configuration file for OpenVPN, which you can use to connect to their VPN service. The file is named `informatica_users.ovpn`.

**On MacOS**

To start OpenVPN service on MacOS, you can use Homebrew. First, ensure you have Homebrew installed. Then, run the following commands:

```bash
sudo brew services start openvpn
```

Start OpenVPN with the provided configuration file:

```bash
sudo /usr/local/opt/openvpn/sbin/openvpn --config informatica_users.ovpn
```

**On Linux**

Start OpenVPN with the provided configuration file:

```sh
sudo openvpn --config informatica_users.ovpn
```

## Adapt

`ssh` into the gungnir server:

```bash
ssh bruzzone@gungnir.adapt.di.unimi.it
```

`scp` files to the gungnir server:

```bash
scp -v file.zip bruzzone@gungnir.adapt.di.unimi.it:~
```
