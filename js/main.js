document.addEventListener("DOMContentLoaded", async () => {
    
    // --- INITIALIZATION ---
    const contentContainer = document.getElementById('content-container'); 

            try {
                const response = await fetch('showcase-content.html');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentHtml = await response.text();
                
                contentContainer.innerHTML = contentHtml;
                
                setTimeout(startPageAnimations, 50); 

            } catch (error) {
                console.error("Failed to load page content:", error);
                contentContainer.innerHTML = "<p style='text-align: center; color: red;'>Error: Could not load showcase content.</p>";
            }

    // --- MAIN CONTENT ANIMATION & INTERACTIVITY LOGIC ---
    function startPageAnimations() {
        
        // --- Hero Title Cascade Animation ---
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle && !heroTitle.classList.contains('animated')) {
            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                if(char === ' ') span.innerHTML = '&nbsp;';
                span.style.animationDelay = `${index * 0.05}s`;
                heroTitle.appendChild(span);
            });
            heroTitle.classList.add('animated');
        }

        // --- Fade-in elements on scroll ---
        const faders = document.querySelectorAll('.fade-in');
        const observerOptions = { threshold: 0.1 };
        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        faders.forEach(fader => appearOnScroll.observe(fader));

        // --- Interactive AFT Workflow Diagram ---
        const aftSteps = document.querySelectorAll('#aft-workflow-diagram .diagram-step');
        const aftInfoBox = document.getElementById('aft-info-box');
        const aftDetails = {
            1: "<strong>Request:</strong> A user requests a new AWS account via the TSP Portal (BMC Helix), providing necessary details like Asset ID and environment.",
            2: "<strong>API Trigger:</strong> The request is processed by on-premise servers and triggers the private Pisces API Gateway in the AFT-Management account.",
            3: "<strong>AFT Pipeline:</strong> The Account Factory for Terraform (AFT) state machine takes over, using GitHub Actions to run Terraform configurations.",
            4: "<strong>Account Ready:</strong> A fully compliant, secure AWS account is created and vended, including all global customizations and security configurations."
        };
        aftSteps.forEach(step => {
            step.addEventListener('click', () => {
                aftSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                if (aftInfoBox) aftInfoBox.innerHTML = aftDetails[step.dataset.step];
            });
        });

        // --- Interactive Log Flow Diagram ---
        initializeLogFlowDiagram();

        // --- CloudCell Integration Showcase ---
        const cloudcellButtons = document.querySelectorAll('#cloudcell-interactive button');
        const cloudcellOutput = document.getElementById('cloudcell-output');
        let isDeploying = false; 
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        cloudcellButtons.forEach(button => {
            button.addEventListener('click', async () => {
                if (isDeploying) return;
                isDeploying = true;
                const module = button.dataset.module;
                cloudcellOutput.innerHTML = '';
                const lines = [
                    { text: `> Requesting deployment of <strong>${module}</strong>...`, delay: 100 },
                    { text: `> Authenticating with JFrog Artifactory... <span style="color: #68d391;">OK</span>`, delay: 500 },
                    { text: `> Pulling verified Terraform module... <span style="color: #68d391;">OK</span>`, delay: 500 },
                    { text: `> Running terraform plan...`, delay: 800 },
                    { text: `  <span style="color: #90cdf4;">+ resource "aws_${module.toLowerCase().split(' ')[0]}" "main" will be created</span>`, delay: 400 },
                    { text: `  <span style="color: #90cdf4;">Plan: 1 to add, 0 to change, 0 to destroy.</span>`, delay: 800 },
                    { text: `> Running terraform apply...`, delay: 1000 },
                    { text: `<span style="color: #68d391;">> ✅ <strong>${module}</strong> deployed successfully with all compliance checks passed.</span>`, delay: 500 },
                    { text: `> Waiting for command...`, delay: 100}
                ];
                for (const line of lines) {
                    await sleep(line.delay);
                    const p = document.createElement('p');
                    p.innerHTML = line.text;
                    cloudcellOutput.appendChild(p);
                    cloudcellOutput.scrollTop = cloudcellOutput.scrollHeight;
                }
                const prompt = cloudcellOutput.lastElementChild;
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                if (prompt) prompt.appendChild(cursor);
                isDeploying = false;
            });
        });

    } // End of startPageAnimations function


    function initializeLogFlowDiagram() {
        const container = document.getElementById('security-log-flow');
        if (!container) return;
        
        const svg = container.querySelector('.log-flow-connectors');
        const infoBox = document.getElementById('log-flow-info-box');
        const simToggleBtn = document.getElementById('simulation-toggle');
        const allNodes = Array.from(container.querySelectorAll('.log-flow-item, .log-flow-hub, .log-flow-process'));
        let allPaths = [];
        let isSimulating = false;
        let simulationInterval;

        const defaultInfoText = "Hover over a component to trace its data path.";

        const descriptions = {
            'source-cloudtrail': '<strong>CloudTrail Logs:</strong> Captures all API activity across accounts. These logs are sent to the Central Security Bucket for audit and threat analysis.',
            'source-config': '<strong>AWS Config Logs:</strong> Records all resource configuration changes, providing a detailed inventory and change history. Logs are stored in the Central Security Bucket.',
            'source-guardduty': '<strong>GuardDuty Findings:</strong> A managed threat detection service that continuously monitors for malicious activity. Findings are aggregated in the Central Security Bucket.',
            'source-sechub': '<strong>Security Hub:</strong> Aggregates security findings from various AWS services (including GuardDuty) and third-party tools into a single, standardized format.',
            'source-vpc': '<strong>VPC Flow Logs:</strong> Captures IP traffic information for all network interfaces. This data is sent to the Central Ops Bucket for operational monitoring.',
            'source-datadog': '<strong>Datadog Forwarder λ:</strong> A Lambda function in each member account that ships metrics, traces, and operational logs directly to Datadog for real-time observability.',
            'hub-security': '<strong>Central Security Bucket:</strong> An S3 bucket in the Log Archive account that serves as the single source of truth for all security-related logs and findings from every account.',
            'hub-ops': '<strong>Central Ops Bucket:</strong> A separate S3 bucket in the Log Archive account for centralizing operational logs, such as VPC Flow Logs and EKS audit logs.',
            'process-sqs': '<strong>Event-Driven Queue:</strong> When a log file arrives in S3, EventBridge detects it and sends a message via SNS to an SQS queue. This decouples ingestion from collection, ensuring reliability.',
            'dest-splunk': '<strong>Splunk:</strong> The primary SIEM platform. It ingests all security and operational logs from the SQS queues for advanced analysis, threat hunting, and compliance reporting.',
            'dest-datadog': '<strong>Datadog:</strong> The primary observability platform. It receives operational logs, metrics, and traces directly from the Forwarder Lambda for monitoring application and infrastructure performance.',
            'dest-expel': '<strong>Expel MDR:</strong> A managed detection and response partner. They ingest critical security logs (like CloudTrail and GuardDuty) from the SQS queue to provide 24/7 security monitoring.',
            'dest-wiz': '<strong>Wiz:</strong> A cloud security platform that connects to the aggregated data in the central S3 buckets to perform posture management, and vulnerability scanning.'
        };
        const connections = {
            'source-cloudtrail': ['hub-security'], 
            'source-config': ['hub-security'], 
            'source-guardduty': ['hub-security'], 
            'source-sechub': ['hub-security'], 
            'source-vpc': ['hub-ops'], 
            'hub-security': ['process-sqs', 'dest-wiz'], 
            'hub-ops': ['process-sqs', 'dest-wiz'], 
            'process-sqs': ['dest-splunk', 'dest-expel'],
            'source-datadog': ['dest-datadog']
        };

        function drawConnectors() {
            if (!svg) return;
            svg.innerHTML = '';
            allPaths = [];
            const containerRect = container.getBoundingClientRect();
            Object.entries(connections).forEach(([startId, endIds]) => {
                const startNode = document.getElementById(startId);
                if (!startNode) return;
                endIds.forEach(endId => {
                    const endNode = document.getElementById(endId);
                    if (!endNode) return;
                    const startRect = startNode.getBoundingClientRect();
                    const endRect = endNode.getBoundingClientRect();
                    const startX = startRect.right - containerRect.left;
                    const startY = startRect.top + startRect.height / 2 - containerRect.top;
                    const endX = endRect.left - containerRect.left;
                    const endY = endRect.top + endRect.height / 2 - containerRect.top;
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const d = `M ${startX} ${startY} C ${startX + 60} ${startY}, ${endX - 60} ${endY}, ${endX} ${endY}`;
                    path.setAttribute('d', d);
                    path.id = `path-${startId}-to-${endId}`;
                    svg.appendChild(path);
                    allPaths.push(path);
                });
            });
        }
        
        function animatePath(path) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('r', '4');
            particle.setAttribute('class', 'flow-particle');
            particle.style.offsetPath = `path('${path.getAttribute('d')}')`;
            svg.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove());
        }

        function highlightPath(nodeId, isSimulation = false) {
            resetHighlight(isSimulation);
            if(infoBox && descriptions[nodeId]) {
                infoBox.innerHTML = isSimulation ? `<strong>Simulating Event:</strong> ${descriptions[nodeId]}`: descriptions[nodeId];
            }
            const connectedElements = new Set([nodeId]);
            let queue = connections[nodeId] ? [...connections[nodeId]] : [];
            while(queue.length > 0) {
                const current = queue.shift();
                connectedElements.add(current);
                if(connections[current]) queue.push(...connections[current]);
            }
            Object.entries(connections).forEach(([start, ends]) => {
                if(ends.includes(nodeId)) {
                    connectedElements.add(start);
                     Object.entries(connections).forEach(([prevStart, prevEnds]) => {
                       if(prevEnds.includes(start)) connectedElements.add(prevStart);
                    });
                }
            });
            allNodes.forEach(node => {
                if(connectedElements.has(node.id)) node.classList.add('highlighted');
            });
            allPaths.forEach(path => {
                const [start, end] = path.id.replace('path-','').split('-to-');
                if(connectedElements.has(start) && connectedElements.has(end)) {
                    path.classList.add('highlighted');
                    animatePath(path);
                }
            });
        }
        
        function resetHighlight(isSimulation = false) {
            if (svg) {
                svg.querySelectorAll('.flow-particle').forEach(p => p.remove());
            }
            if(infoBox && !isSimulation) {
                infoBox.innerHTML = defaultInfoText;
            }
            allNodes.forEach(node => node.classList.remove('highlighted'));
            allPaths.forEach(path => path.classList.remove('highlighted'));
        }

        function toggleSimulation() {
            isSimulating = !isSimulating;
            container.classList.toggle('simulation-active', isSimulating);
            simToggleBtn.classList.toggle('simulating', isSimulating);
            simToggleBtn.textContent = isSimulating ? 'Stop Simulation' : 'Start Simulation';
            if (isSimulating) {
                resetHighlight(true);
                const sources = allNodes.filter(n => n.id.startsWith('source-')).map(n => n.id);
                simulationInterval = setInterval(() => {
                    const randomSource = sources[Math.floor(Math.random() * sources.length)];
                    highlightPath(randomSource, true);
                }, 2500);
            } else {
                clearInterval(simulationInterval);
                resetHighlight(false);
            }
        }
        
        allNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                if (!isSimulating) {
                    highlightPath(node.id);
                }
            });
        });

        container.addEventListener('mouseleave', () => {
             if (!isSimulating) {
                resetHighlight();
             }
        });
        
        simToggleBtn.addEventListener('click', toggleSimulation);

        if (infoBox) infoBox.innerHTML = defaultInfoText;
        drawConnectors();
        new ResizeObserver(drawConnectors).observe(container);
    }
}); 