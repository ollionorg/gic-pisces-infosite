# Project Pisces Interactive Showcase

This project is a dynamic, single-page web application created to showcase the key features and architecture of Project Pisces. It includes several interactive diagrams and animations to explain complex cloud infrastructure concepts in an intuitive way.

The showcase is designed to be a self-contained presentation tool, requiring only a modern web browser to run.

## Features

* **Automated Account Provisioning**: An interactive diagram illustrating the AFT workflow from request to a ready-to-use AWS account.
* **Centralized Security & Monitoring**: A detailed, multi-stage animated diagram showing the flow of security and operational logs from source to SIEM.
    * **Interactive Highlighting**: Hover over any component to trace its specific data path.
    * **Live Simulation Mode**: An automated mode that simulates random log events to demonstrate the event-driven architecture in action.
* **Technology Showcase**: Visuals for the core technology stack and an interactive mock-terminal for the CloudCell integration.

## Technology Stack

* **HTML5**
* **CSS3** (utilizing Flexbox and CSS Grid for layout)
* **Vanilla JavaScript (ES6+)** for all animations, interactivity, and dynamic content loading.

## Local Deployment

To run and view the interactive showcase on your local machine, you will need Visual Studio Code and the **Live Server** extension.

1.  **Download/Clone Source Code**
    Clone this repository or download the project files to a folder on your computer.

2.  **Open in VS Code**
    Open the project folder in Visual Studio Code.

3.  **Install Live Server Extension**
    If you do not have it installed, go to the **Extensions** view (`Ctrl+Shift+X`) in VS Code and search for `Live Server` by Ritwick Dey. Click **Install**.

    ![Live Server Extension](https://marketplace.visualstudio.com/items?itemName=yandeu.five-server)

4.  **Launch the Showcase**
    Right-click the `index.html` file in the VS Code Explorer panel and select **"Open with Live Server"**.

    ![Go Live]

5.  **View and Interact**
    Your default web browser will automatically open to the correct address, and you can view the showcase.

> **Note**: You will need to enter the password `pisces2025` to view the content.