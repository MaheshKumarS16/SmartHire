USE smarthire;

-- Update messy test jobs with real high quality jobs
UPDATE jobs SET 
  title = 'Lead Cloud Architect',
  company = 'Amazon Web Services',
  location = 'Hyderabad, India',
  salary = '₹42 - ₹55 LPA',
  description = 'AWS is looking for a Lead Cloud Architect to design mission-critical multi-region distributed cloud architectures for enterprise customers. Deep expertise in AWS Well-Architected Framework, Kubernetes (EKS), Terraform, and scalable microservices is required.',
  status = 'OPEN',
  recruiter_id = 12
WHERE id = 7;

UPDATE jobs SET 
  title = 'Senior Frontend Engineer (React/TypeScript)',
  company = 'Razorpay',
  location = 'Bangalore, India',
  salary = '₹24 - ₹34 LPA',
  description = 'Join Razorpay to build next-generation payment checkout flows and developer dashboards used by millions of merchants daily. Experience with React 19, TypeScript, Webpack/Vite, micro-frontends, and web performance optimization is essential.',
  status = 'OPEN',
  recruiter_id = 12
WHERE id = 9;

UPDATE jobs SET 
  title = 'Staff Backend Engineer (Distributed Systems)',
  company = 'Uber',
  location = 'Bangalore, India',
  salary = '₹48 - ₹68 LPA',
  description = 'Lead the core mobility matching algorithms and high-throughput dispatch engine. You will design systems handling hundreds of thousands of events per second with sub-50ms latency using Go, Java, Kafka, and Redis.',
  status = 'OPEN',
  recruiter_id = 12
WHERE id = 10;

UPDATE jobs SET 
  title = 'Full Stack Developer (Next.js / Node.js)',
  company = 'CRED',
  location = 'Bangalore, India',
  salary = '₹26 - ₹38 LPA',
  description = 'Design delightfully crafted, high-speed financial experiences. You will collaborate with elite designers and engineers to create seamless user interfaces in React/Next.js backed by resilient Node.js and GraphQL services.',
  status = 'OPEN',
  recruiter_id = 12
WHERE id = 11;

UPDATE jobs SET 
  title = 'Senior Java Backend Engineer',
  company = 'Swiggy',
  location = 'Bangalore, India',
  salary = '₹22 - ₹32 LPA',
  description = 'Work on Swiggy delivery logistics and real-time order tracking platform. Build reactive Spring Boot microservices capable of scaling to over 100,000 requests per second with high fault tolerance and resilient circuit breaking.',
  status = 'OPEN',
  recruiter_id = 7
WHERE id = 15;

UPDATE jobs SET 
  title = 'Staff Product Designer (UI/UX)',
  company = 'Atlassian',
  location = 'Remote, India',
  salary = '₹25 - ₹35 LPA',
  description = 'Atlassian is seeking a Staff Product Designer to shape the collaboration and project tracking tools used by millions of developers worldwide. Strong experience in Figma, design systems, user research, and interaction design required.',
  status = 'OPEN',
  recruiter_id = 12
WHERE id = 16;

-- Insert 15 more realistic jobs to reach 28+ jobs total
INSERT INTO jobs (title, company, location, salary, description, status, recruiter_id) VALUES
('Machine Learning Engineer (LLMs & NLP)', 'Microsoft', 'Hyderabad, India', '₹32 - ₹48 LPA', 'Contribute to Microsoft Azure AI & Copilot engineering. Develop fine-tuned LLM pipelines, RAG systems, and semantic search indexes using PyTorch, Hugging Face, LangChain, and vector databases.', 'OPEN', 12),

('Cloud DevOps Engineer (Kubernetes & CI/CD)', 'PhonePe', 'Bangalore, India', '₹20 - ₹28 LPA', 'Manage large-scale Kubernetes clusters running millions of UPI transactions per day. Implement GitOps with ArgoCD, Terraform, Prometheus, and Grafana monitoring stacks.', 'OPEN', 7),

('Data Platform Engineer (Spark / Kafka / Iceberg)', 'Flipkart', 'Bangalore, India', '₹25 - ₹36 LPA', 'Build petabyte-scale real-time data streaming and lakehouse infrastructure supporting analytics and inventory forecasting across India largest e-commerce platform.', 'OPEN', 12),

('Mobile Engineer (React Native & iOS)', 'Zomato', 'Gurgaon, India', '₹18 - ₹26 LPA', 'Craft lightning-fast mobile ordering flows for millions of food and grocery deliveries. Proficiency in React Native, Native iOS/Swift bridging, animation performance, and offline caching.', 'OPEN', 7),

('Principal Security Engineer (Application Security)', 'Google', 'Bangalore, India', '₹55 - ₹80 LPA', 'Drive threat modeling, secure architecture reviews, and zero-trust engineering across mission-critical cloud applications. Deep knowledge of cryptography, OWASP top 10, and vulnerability mitigation.', 'OPEN', 12),

('Site Reliability Engineer (SRE)', 'Adobe', 'Noida, India', '₹22 - ₹32 LPA', 'Ensure 99.99% availability for Adobe Creative Cloud services worldwide. Lead incident retrospectives, chaotic resilience testing, automated failovers, and SLI/SLO tracking.', 'OPEN', 7),

('Frontend Systems Engineer (Design Systems)', 'Canva', 'Remote, India', '₹28 - ₹38 LPA', 'Build accessible, themeable web components and core design token architectures. Expertise in TypeScript, CSS architecture, Web Components, and automated visual regression testing.', 'OPEN', 12),

('High-Throughput Systems Engineer (Go / gRPC)', 'Zerodha', 'Bangalore, India', '₹30 - ₹45 LPA', 'Build ultra-low latency order execution engines and market data feeds. Deep expertise with Go, zero-allocation network programming, WebSockets, and Linux kernel tuning.', 'OPEN', 12),

('QA Lead & Test Automation Architect', 'Freshworks', 'Chennai, India', '₹16 - ₹24 LPA', 'Lead quality engineering for multi-tenant CRM products. Design end-to-end automated testing frameworks using Playwright, Cypress, Jest, and CI integration pipelines.', 'OPEN', 7),

('AI Research Scientist (Computer Vision)', 'NVIDIA', 'Pune, India', '₹45 - ₹65 LPA', 'Research deep learning models for autonomous vehicles and generative video synthesis using TensorRT, CUDA, and massive distributed GPU clusters.', 'OPEN', 12),

('Senior Engineering Manager (Fintech)', 'Paytm', 'Noida, India', '₹45 - ₹60 LPA', 'Lead a team of 15+ backend and frontend engineers building core banking integrations, fraud prevention engines, and settlement infrastructure.', 'OPEN', 7),

('Staff Android Architect (Kotlin / Jetpack Compose)', 'Meesho', 'Bangalore, India', '₹30 - ₹42 LPA', 'Architect modular, battery-efficient Android applications running on diverse low-end Android hardware across tier-2 and tier-3 Indian cities.', 'OPEN', 12),

('Senior Technical Product Manager', 'Zepto', 'Mumbai, India', '₹28 - ₹40 LPA', 'Own the 10-minute grocery delivery routing algorithms and dark store fulfillment systems. Work with data scientists and operations teams to optimize picking speeds.', 'OPEN', 7),

('Database Administrator (MySQL / TiDB)', 'Zoho', 'Chennai, India', '₹15 - ₹22 LPA', 'Manage thousands of relational database instances, query optimization, automated backups, partition pruning, and active-active clustering.', 'OPEN', 7),

('Senior Rust Systems Developer', 'CoinDCX', 'Remote, India', '₹35 - ₹50 LPA', 'Build high-frequency cryptocurrency order matching engines and cryptographic signing services in Rust with asynchronous Tokio runtime and zero-garbage-collection latency guarantees.', 'OPEN', 12);
