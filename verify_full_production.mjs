const API_URL = "https://smarthire-qqu1.onrender.com/api";
const VERCEL_URL = "https://smart-hire-alpha-seven.vercel.app";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runComprehensiveValidation() {
  console.log("============================================================");
  console.log("SMART HIRE — FULL PRODUCTION & DATA VALIDATION SUITE");
  console.log("============================================================");
  console.log(`Live Frontend: ${VERCEL_URL}`);
  console.log(`Live Backend:  ${API_URL}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // --- PHASE 1: Vercel Frontend Availability & Assets ---
  console.log("\n>>> PHASE 1: Vercel Frontend Audit <<<");
  try {
    const res = await fetch(VERCEL_URL);
    assert(res.status === 200, `Frontend root returns HTTP 200 (Got ${res.status})`);
    const html = await res.text();
    assert(html.includes("SmartHire"), "Frontend title/meta present");
    assert(!html.includes("localhost"), "No localhost leaks in production HTML");
  } catch (e) {
    assert(false, `Frontend fetch failed: ${e.message}`);
  }

  // --- PHASE 2: Wait for Render backend deployment / sync ---
  console.log("\n>>> PHASE 2: Backend Health & Job Data Audit <<<");
  let allJobs = [];
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      if (res.status === 200) {
        const data = await res.json();
        allJobs = Array.isArray(data.data) ? data.data : [];
        if (allJobs.length >= 20) {
          console.log(`Backend ready with ${allJobs.length} jobs on attempt ${attempt}.`);
          break;
        }
      }
    } catch (e) {
      console.log(`Waiting for backend sync... (${attempt}/8)`);
    }
    await sleep(6000);
  }

  assert(allJobs.length >= 20, `Database contains 20+ demo jobs (Found: ${allJobs.length} jobs)`);

  // Check no corrupted jobs exist
  const corrupted = allJobs.filter((j) => {
    const d = (j.description || "").toLowerCase();
    return d.includes("lhfwhkrnv") || d.length < 15;
  });
  assert(corrupted.length === 0, `Zero corrupted/garbled jobs found (Corrupted count: ${corrupted.length})`);

  // --- PHASE 3: Search Functionality Audit ---
  console.log("\n>>> PHASE 3: Search Functionality Testing <<<");
  const searchKeywords = ["Java", "React", "Data Analyst", "Developer", "Python", "SQL", "Software Engineer"];
  for (const keyword of searchKeywords) {
    try {
      const res = await fetch(`${API_URL}/jobs/search?title=${encodeURIComponent(keyword)}&status=OPEN`);
      const data = await res.json();
      const list = data.data?.content || data.data || [];
      assert(list.length > 0, `Search keyword "${keyword}" returned ${list.length} relevant jobs`);
    } catch (e) {
      assert(false, `Search keyword "${keyword}" error: ${e.message}`);
    }
  }

  const searchLocations = ["Bangalore", "Chennai", "Hyderabad", "Pune", "Remote"];
  for (const loc of searchLocations) {
    try {
      const res = await fetch(`${API_URL}/jobs/search?location=${encodeURIComponent(loc)}&status=OPEN`);
      const data = await res.json();
      const list = data.data?.content || data.data || [];
      assert(list.length > 0, `Location search "${loc}" returned ${list.length} matching jobs`);
    } catch (e) {
      assert(false, `Location search "${loc}" error: ${e.message}`);
    }
  }

  // --- PHASE 4: Job Details Verification ---
  console.log("\n>>> PHASE 4: Job Details Data Quality <<<");
  const sampleJobs = allJobs.slice(0, 5);
  for (const sample of sampleJobs) {
    try {
      const res = await fetch(`${API_URL}/jobs/${sample.id}`);
      const data = await res.json();
      const j = data.data || data;
      const hasAllFields = j.id && j.title && j.company && j.location && j.salary && j.description && j.status;
      assert(!!hasAllFields, `Job ID ${j.id} (${j.title} at ${j.company}) has complete fields without nulls`);
      assert(j.description.length > 50, `Job ID ${j.id} description has rich structured content (${j.description.length} chars)`);
    } catch (e) {
      assert(false, `Job details error for ID ${sample.id}: ${e.message}`);
    }
  }

  // --- PHASE 5: Candidate End-to-End Workflow ---
  console.log("\n>>> PHASE 5: Candidate End-to-End Flow <<<");
  const timestamp = Date.now();
  const candEmail = `candidate_qa_${timestamp}@smarthire.demo`;
  const recrEmail = `recruiter_qa_${timestamp}@smarthire.demo`;
  const password = "Password@123";

  let candToken = null;
  let recrToken = null;
  let targetJobId = allJobs[0]?.id;
  let targetAppId = null;

  // 1. Candidate Register
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mahesh Candidate",
        email: candEmail,
        password: password,
        role: "CANDIDATE"
      })
    });
    const d = await res.json();
    assert(res.status === 201 || res.status === 200, `Candidate registration HTTP ${res.status}`);
  } catch (e) {
    assert(false, `Candidate register error: ${e.message}`);
  }

  // 2. Candidate Login
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: candEmail, password: password })
    });
    const d = await res.json();
    candToken = d.data?.token || d.token;
    assert(candToken != null, "Candidate login returned valid JWT token");
  } catch (e) {
    assert(false, `Candidate login error: ${e.message}`);
  }

  // 3. Candidate Profile Update
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candToken}`
      },
      body: JSON.stringify({
        name: "Mahesh Candidate",
        summary: "Passionate Full Stack Developer with expertise in React and Spring Boot.",
        skills: "Java, Spring Boot, React, MySQL, TypeScript, Docker",
        education: "B.Tech Computer Science",
        experience: "3 Years",
        phone: "+91 9123456780",
        location: "Bangalore, Karnataka"
      })
    });
    const d = await res.json();
    assert(res.status === 200, `Profile update succeeded (HTTP 200)`);
    assert(d.data?.summary?.includes("Full Stack Developer"), "Profile summary verified");
  } catch (e) {
    assert(false, `Profile update error: ${e.message}`);
  }

  // 4. Candidate Resume Upload
  try {
    const formData = new FormData();
    const resumeBlob = new Blob(["Candidate Resume Content - QA Final Release Verification"], { type: "application/pdf" });
    formData.append("file", resumeBlob, "mahesh_resume.pdf");

    const res = await fetch(`${API_URL}/profile/resume`, {
      method: "POST",
      headers: { Authorization: `Bearer ${candToken}` },
      body: formData
    });
    const d = await res.json();
    assert(res.status === 200, `Resume upload succeeded (HTTP 200)`);
    assert(d.data?.hasResume === true, "Resume flag set to true in candidate profile");
  } catch (e) {
    assert(false, `Resume upload error: ${e.message}`);
  }

  // 5. Candidate Apply for Job
  try {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candToken}`
      },
      body: JSON.stringify({
        jobId: targetJobId,
        coverLetter: "Excited to apply for this position!"
      })
    });
    const d = await res.json();
    assert(res.status === 201 || res.status === 200, `Job application submitted (HTTP ${res.status})`);
    targetAppId = d.data?.id;
  } catch (e) {
    assert(false, `Job application error: ${e.message}`);
  }

  // 6. Duplicate Application Prevention Check
  try {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candToken}`
      },
      body: JSON.stringify({ jobId: targetJobId })
    });
    assert(res.status === 400 || res.status === 409, `Duplicate application properly rejected (HTTP ${res.status})`);
  } catch (e) {
    assert(false, `Duplicate application check error: ${e.message}`);
  }

  // 7. Candidate View My Applications
  try {
    const res = await fetch(`${API_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${candToken}` }
    });
    const d = await res.json();
    assert(res.status === 200, `My Applications fetched (HTTP 200)`);
    const app = d.data?.find((a) => a.id === targetAppId || a.jobId === targetJobId);
    assert(app != null, `Submitted application present in candidate history (Status: ${app?.status})`);
  } catch (e) {
    assert(false, `My applications error: ${e.message}`);
  }

  // --- PHASE 6: Recruiter End-to-End Workflow ---
  console.log("\n>>> PHASE 6: Recruiter End-to-End Flow <<<");

  // 1. Recruiter Register
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Priya HR Lead",
        email: recrEmail,
        password: password,
        role: "RECRUITER"
      })
    });
    assert(res.status === 201 || res.status === 200, `Recruiter registration HTTP ${res.status}`);
  } catch (e) {
    assert(false, `Recruiter register error: ${e.message}`);
  }

  // 2. Recruiter Login
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: recrEmail, password: password })
    });
    const d = await res.json();
    recrToken = d.data?.token || d.token;
    assert(recrToken != null, "Recruiter login returned valid JWT token");
  } catch (e) {
    assert(false, `Recruiter login error: ${e.message}`);
  }

  // 3. Recruiter Post Job
  let recrJobId = null;
  try {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${recrToken}`
      },
      body: JSON.stringify({
        title: "Senior AI Solutions Architect",
        company: "InnovateHub",
        location: "Bangalore, Karnataka",
        salary: "₹18–25 LPA",
        description: "Leading generative AI applications and cloud solutions engineering.\n\nResponsibilities:\n- Design scalable LLM pipelines\n- Collaborate with enterprise clients\n\nRequirements:\n- 5+ years experience in AI/ML and distributed systems"
      })
    });
    const d = await res.json();
    assert(res.status === 201 || res.status === 200, `Recruiter created job (HTTP ${res.status})`);
    recrJobId = d.data?.id;
  } catch (e) {
    assert(false, `Recruiter create job error: ${e.message}`);
  }

  // 4. Candidate Applies to Recruiter's Job
  let recrAppId = null;
  try {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candToken}`
      },
      body: JSON.stringify({ jobId: recrJobId, coverLetter: "Excited for AI Architect role." })
    });
    const d = await res.json();
    assert(res.status === 201 || res.status === 200, `Candidate applied to recruiter job (HTTP ${res.status})`);
    recrAppId = d.data?.id;
  } catch (e) {
    assert(false, `Application to recruiter job error: ${e.message}`);
  }

  // 5. Recruiter Views Applicants for Job
  try {
    const res = await fetch(`${API_URL}/applications/job/${recrJobId}`, {
      headers: { Authorization: `Bearer ${recrToken}` }
    });
    const d = await res.json();
    assert(res.status === 200, `Recruiter fetched applicants (HTTP 200)`);
    const applicant = d.data?.find((a) => a.id === recrAppId);
    assert(applicant != null, `Applicant found in recruiter ATS table (Name: ${applicant?.candidateName})`);
    assert(applicant?.hasResume === true, "Applicant resume status confirmed");
  } catch (e) {
    assert(false, `Recruiter applicants error: ${e.message}`);
  }

  // 6. Recruiter Updates Application Status
  try {
    const res = await fetch(`${API_URL}/applications/${recrAppId}/status?status=SHORTLISTED`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${recrToken}` }
    });
    const d = await res.json();
    assert(res.status === 200, `Status updated to SHORTLISTED (HTTP 200)`);
  } catch (e) {
    assert(false, `Status update error: ${e.message}`);
  }

  // 7. Candidate Status Reflection
  try {
    const res = await fetch(`${API_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${candToken}` }
    });
    const d = await res.json();
    const app = d.data?.find((a) => a.id === recrAppId);
    assert(app?.status === "SHORTLISTED", `Candidate sees updated SHORTLISTED status in real-time`);
  } catch (e) {
    assert(false, `Candidate status reflection error: ${e.message}`);
  }

  // --- PHASE 7: Role-Based Authorization Tests ---
  console.log("\n>>> PHASE 7: Security & Authorization Audit <<<");

  // Candidate attempting to post a job (Should be 403 Forbidden)
  try {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candToken}`
      },
      body: JSON.stringify({ title: "Hacked Job", company: "Fake", location: "Any", salary: "0", description: "Test" })
    });
    assert(res.status === 403, `Candidate blocked from posting jobs (HTTP 403 Forbidden)`);
  } catch (e) {
    assert(false, `Role security error: ${e.message}`);
  }

  // Unauthenticated access to /applications/my (Should be 401 Unauthorized)
  try {
    const res = await fetch(`${API_URL}/applications/my`);
    assert(res.status === 401, `Unauthenticated request blocked from /applications/my (HTTP 401)`);
  } catch (e) {
    assert(false, `Unauthenticated security error: ${e.message}`);
  }

  console.log("\n============================================================");
  console.log(`FULL VALIDATION COMPLETE — Passed: ${passed} | Failed: ${failed}`);
  console.log("============================================================");

  if (failed === 0) {
    console.log("🎉 ALL PRODUCTION VALIDATION PHASES PASSED WITH 100% SUCCESS!");
  }
}

runComprehensiveValidation();
