document.addEventListener("DOMContentLoaded", () => {
    
    // --- PASSWORD PROTECTION LOGIC ---
    const overlay = document.getElementById('password-overlay');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const contentContainer = document.getElementById('content-container'); 
    
    const correctPassword = 'pisces2025';
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        if (passwordInput.value === correctPassword) {
            overlay.classList.add('hidden');
            
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

        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
        }
    });

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

        // --- Centralized Security Carousel Logic ---
        const carousel = document.getElementById('security-carousel');
        if (carousel) {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const dotsContainer = document.getElementById('carousel-dots');
            const overviewIcons = carousel.querySelectorAll('.diagram-overview-icon');
            let currentSlide = 0;
            let slideInterval;

            if(slides.length > 0) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    dot.addEventListener('click', () => setSlide(index));
                    if (dotsContainer) dotsContainer.appendChild(dot);
                });

                const dots = dotsContainer.querySelectorAll('.carousel-dot');

                const setSlide = (index) => {
                    if (!slides[index]) return;
                    
                    slides.forEach(slide => slide.classList.remove('active'));
                    dots.forEach(dot => dot.classList.remove('active'));

                    const activeSlide = slides[index];
                    activeSlide.classList.add('active');
                    if (dots[index]) dots[index].classList.add('active');
                    
                    // CRITICAL FIX: Adjust carousel height to match the active slide's content
                    carousel.style.height = `${activeSlide.scrollHeight}px`;
                    
                    currentSlide = index;

                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextSlide, 7000);
                };

                const nextSlide = () => {
                    const newIndex = (currentSlide + 1) % slides.length;
                    setSlide(newIndex);
                };

                overviewIcons.forEach(icon => {
                    icon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const targetSlideIndex = parseInt(icon.dataset.targetSlide, 10);
                        setSlide(targetSlideIndex);
                    });
                });

                setSlide(0); // Initialize the first slide
            }
        }

        // --- Live Security Feed Logic ---
        const statusFeed = document.getElementById('status-feed');
        if (statusFeed) {
            const events = [
                { sev: 'high', tool: 'GuardDuty', msg: 'Unusual API activity from IP 203.0.113.45' },
                { sev: 'high', tool: 'Wiz', msg: 'New critical vulnerability found: Log4j' },
                { sev: 'medium', tool: 'Config', msg: 'S3 bucket "finance-q3" is now public' },
                { sev: 'medium', tool: 'Security Hub', msg: 'EC2 i-012345 fails CIS Benchmark 2.2' },
                { sev: 'low', tool: 'Datadog', msg: 'CPU utilization for rds-prod > 80% for 5m' },
                { sev: 'low', tool: 'GuardDuty', msg: 'Anomalous login from an unused region' },
                { sev: 'high', tool: 'Wiz', msg: 'Publicly exposed database with sensitive data' }
            ];
            const addFeedEntry = () => {
                const event = events[Math.floor(Math.random() * events.length)];
                const newEntry = document.createElement('p');
                newEntry.className = `feed-entry ${event.sev}`;
                const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
                newEntry.innerHTML = `[${timestamp}] <span class="tool">[${event.tool}]</span> ${event.msg}`;
                statusFeed.prepend(newEntry);
                if (statusFeed.childElementCount > 8) {
                    statusFeed.lastChild.remove();
                }
            };
            addFeedEntry();
            setInterval(addFeedEntry, 3500);
        }

    } // End of startPageAnimations function
});