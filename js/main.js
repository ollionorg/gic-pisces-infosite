document.addEventListener("DOMContentLoaded", () => {
    
    // --- PASSWORD PROTECTION LOGIC ---
    const overlay = document.getElementById('password-overlay');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    
    const correctPassword = 'pisces2025';
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (passwordInput.value === correctPassword) {
            overlay.classList.add('hidden');
            // Delay start of animations to allow overlay to fade out
            setTimeout(startPageAnimations, 100);
        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
        }
    });

    // --- MAIN CONTENT ANIMATION & INTERACTIVITY LOGIC ---
    function startPageAnimations() {
        // NEW: Hero Title Cascade Animation
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle && !heroTitle.classList.contains('animated')) {
            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                // Use non-breaking space for spaces to maintain layout
                if(char === ' ') span.innerHTML = '&nbsp;';
                span.style.animationDelay = `${index * 0.05}s`;
                heroTitle.appendChild(span);
            });
            heroTitle.classList.add('animated');
        }


        // --- Fade-in elements on scroll ---
        const faders = document.querySelectorAll('.fade-in');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation for a more dynamic effect
                    entry.target.style.transitionDelay = `${index * 50}ms`;
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
            2: "<strong>API Trigger:</strong> The request is processed by on-premise servers and triggers the private Pisces API Gateway in the AFT-Management account, initiating the automated workflow.",
            3: "<strong>AFT Pipeline:</strong> The Account Factory for Terraform (AFT) state machine takes over. It uses GitHub Actions to run Terraform configurations, provisioning the account within the AWS Control Tower guardrails.",
            4: "<strong>Account Ready:</strong> A fully compliant, secure AWS account is created and vended. It includes all global customizations like IAM roles, security configurations, and necessary integrations."
        };

        aftSteps.forEach(step => {
            step.addEventListener('click', () => {
                aftSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                aftInfoBox.innerHTML = aftDetails[step.dataset.step];
            });
        });

        // --- CloudCell Integration Showcase ---
        const cloudcellButtons = document.querySelectorAll('#cloudcell-interactive button');
        const cloudcellOutput = document.getElementById('cloudcell-output');
        cloudcellButtons.forEach(button => {
            button.addEventListener('click', () => {
                const module = button.dataset.module;
                cloudcellOutput.innerHTML = `> Requesting deployment of <strong>${module}</strong> from CloudCell...
> Authenticating with JFrog Artifactory...
> Pulling verified Terraform module...
> Running terraform apply...
> ✅ <strong>${module}</strong> deployed successfully with all compliance checks passed.`;
            });
        });

        // --- Breakglass Modal Logic ---
        const breakglassModal = document.getElementById('breakglass-modal');
        const openModalBtn = document.getElementById('breakglass-modal-button');
        const closeModalBtn = breakglassModal.querySelector('.close-button');
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const stepsContainer = breakglassModal.querySelector('.breakglass-steps');

        const breakglassSteps = [
            {
                title: "Step 1: Initiation",
                content: "The BCM team initiates the breakglass procedure. Designated personnel from the <strong>IAM and OCT teams</strong> physically retrieve the breakglass user credentials from a secure data center safe."
            },
            {
                title: "Step 2: IAM Team Access",
                content: "The designated IAM personnel signs into the Pisces Management Account using the <strong>PISCES-LZ-MGMT-IAM-BREAKGLASS</strong> user credentials, which has IAMFullAccess."
            },
            {
                title: "Step 3: Create Ephemeral User",
                content: "The IAM user creates an ephemeral IAM user for the OCT team: <strong>PISCES-LZ-MGMT-OCT-BREAKGLASS</strong>. This user is granted temporary AdministratorAccess."
            },
            {
                title: "Step 4: OCT Team Remediation",
                content: "The OCT team signs in as the ephemeral user to perform emergency remediation. If access to other accounts is needed, a pre-defined CloudFormation StackSet is deployed to create a <strong>PISCES-LZ-PRD-BREAKGLASS-ROLE</strong> in target accounts."
            },
            {
                title: "Step 5: Monitoring & Cleanup",
                content: "All actions are logged in CloudTrail and trigger alerts. After the incident is resolved, the ephemeral user and any created StackSets are deleted, and the primary breakglass user's credentials are rotated."
            }
        ];
        
        let currentStep = 0;

        function renderSteps(direction = 'in') {
            const activeStep = stepsContainer.querySelector('.breakglass-step.active');
            if (activeStep) {
                activeStep.classList.add('exiting');
                activeStep.classList.remove('active');
            }
            
            // Allow time for exit animation before showing the new step
            setTimeout(() => {
                stepsContainer.innerHTML = '';
                breakglassSteps.forEach((step, index) => {
                    const stepEl = document.createElement('div');
                    stepEl.classList.add('breakglass-step');
                    if (index === currentStep) {
                         stepEl.classList.add('active');
                    }
                    stepEl.innerHTML = `<h4>${step.title}</h4><p>${step.content}</p>`;
                    stepsContainer.appendChild(stepEl);
                });
                updateNavButtons();
            }, 250); // Half of the animation duration
        }

        function updateNavButtons() {
            prevBtn.disabled = currentStep === 0;
            nextBtn.textContent = currentStep === breakglassSteps.length - 1 ? 'Finish' : 'Next';
        }

        openModalBtn.onclick = () => {
            currentStep = 0;
            renderSteps();
            breakglassModal.style.display = 'flex';
        }
        closeModalBtn.onclick = () => breakglassModal.style.display = 'none';
        
        nextBtn.onclick = () => {
            if (currentStep < breakglassSteps.length - 1) {
                currentStep++;
                renderSteps('in');
            } else {
                breakglassModal.style.display = 'none';
            }
        };

        prevBtn.onclick = () => {
            if (currentStep > 0) {
                currentStep--;
                renderSteps('out');
            }
        };

        window.onclick = (event) => {
            if (event.target == breakglassModal) {
                breakglassModal.style.display = 'none';
            }
        }
    }
});