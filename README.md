![](https://i.imgur.com/w1WpBj9.png)

<p align="center">
    <a><img src="https://github.com/inexio/snmp-sim-ui/workflows/Build (Mac)/badge.svg"></a>
    <a><img src="https://github.com/inexio/snmp-sim-ui/workflows/Build (Win)/badge.svg"></a>
</p>

<p align="center">
    <a><img src="https://img.shields.io/github/v/release/inexio/snmp-sim-ui?include_prereleases"></a>
    <a><img src="https://img.shields.io/github/downloads/inexio/snmp-sim-ui/total?color=brightgreen"></a>
    <a><img src="https://img.shields.io/github/issues/inexio/snmp-sim-ui"></a>
    <a><img src="https://img.shields.io/github/issues-pr/inexio/snmp-sim-ui"></a>
</p>

<p align="center"><a href="https://github.com/inexio/snmp-sim-ui/releases/latest">Download latest Release</a></p>

## Description

<a><img src="https://i.imgur.com/YvoTjgC.png" alt="SNMP Sim UI Icon" align="right" /></a>

The SNMP Sim UI (short for SNMP Simulator User Interface) is both a Web and Desktop Application used to manage multiple
simulated SNMP objects such as Agents, Engines, Endpoints, and Users which are grouped into Labs.

This tool is designed to work hand-in-hand with the main SNMP Simulator Rest API running on a dedicated Server. This tool then communicates with the Management and Metrics Endpoints of the SNMP Simulator Rest API.

## Installation

For the installation of the core SNMP Simulator, please visit [this page](http://snmplabs.com/snmpsim-control-plane/deployment.html).

There are two seperate installation guides depending on whether you want to install the SNMP Sim UI on a Web Server and make it
accessible through the browsers or if you want to run it as a local app on your Desktop, which updates itself automatically.

### Web App

<details>
    <summary>Installation Guide</summary>
    <br>
    First things first, you need to have a Web Server such as Nginx or Apache installed already (Express works too, as long as its set up to serve static files).
    <br><br>
    The second step is to go to the <a href="https://github.com/inexio/snmp-sim-ui/releases/latest">latest release</a> and download the <a href="https://github.com/inexio/snmp-sim-ui/releases/latest">SNMP.Simulator-X.X.X-Web.zip</a>-file which includes all the files needed for the deployment of the Web App.
    <br><br>
    Last but not least, extract the files contents and upload them onto your web server.
    <br><br>
    <b>IMPORTANT:</b> Please note, that the prebuild Web App can only run in the root directory of the web server so the final address looks like `localhost:3000` or `snmp.example.com` and NOT like `localhost:3000/web` or `snmp.example.com/web`
    <br><br>
    🎉 You should now be able to go to your configured domain (or the IP Address) of your web server and get started.
    <br><br>
</details>

### Desktop App

<details>
    <summary>Installation Guide</summary>
    <br>
    First, go to the <a href="https://github.com/inexio/snmp-sim-ui/releases/latest">latest release</a> and click on "Assets".
    There you can download the latest version for your operating system.
    <br><br>
    This will download an installer which lets you choose where to install the SNMP Sim UI and also where future updates will be installed.
    <br><br>
    🎉 Done installing? You should now be able to open the App and continue with the initial setup!
    <br><br>
</details>

## Initial Setup

When opening the App for the first time (or after signing out), you will be prompted to do a first time setup:
![](https://i.imgur.com/j9v7Ds0.png)

After clicking on "Get Started", you will be taken to the second page where you are prompted to enter the details for the
Management Endpoint of the SNMP Sim Rest API.

You need to provide the Address and the Port on which the Management API is listening on. Optionally, you can also specify Authentication details, if you set any up on your web server.
![](https://i.imgur.com/Xt8J7eW.png)

Next step is the same for the Metrics API. You again have to specify the Address and the Port on which the Metrics API is listening. Most of the information will be prefilled from the previous step.
![](https://i.imgur.com/EU12gBD.png)

In the last step of the initial setup process, you can review your configuration and then start a validation reqeust against the Management and Metrics Endpoints. Once successful, you will be redirected to the welcome page of the SNMP Sim UI.

All of your entered information will be stored until you log out using the red "log out" button in the top right corner. If you log out though, you will have to go through the setup again.
![](https://i.imgur.com/PFJKbFV.png)

## Authors

-   **Juri Adams** - _Initial Work_ - [@4dams](https://github.com/4dams)

## License

This project is underlying the MIT-License. For more information, take a look at this projects LICENSE.md file.
