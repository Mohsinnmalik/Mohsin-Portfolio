"use strict";(()=>{var e={};e.id=979,e.ids=[979],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9299:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>I,requestAsyncStorage:()=>c,routeModule:()=>l,serverHooks:()=>d,staticGenerationAsyncStorage:()=>p});var o={};t.r(o),t.d(o,{POST:()=>u});var n=t(9303),s=t(8716),i=t(670),a=t(7070);async function u(e){try{let r=await e.json(),t=r?.text;if(!t||"string"!=typeof t)return a.NextResponse.json({error:"Valid text payload is required"},{status:400});let o=process.env.GEMINI_API_KEY||process.env.NEXT_PUBLIC_GEMINI_API_KEY;if(!o)return console.error("Missing Gemini API Key in environment variables."),a.NextResponse.json({error:"Gemini API Key is missing from server environment."},{status:500});let n=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`
            ### CONTEXT: MOHSIN MALIK — AI PORTFOLIO ASSISTANT (LAYER-3 HUMANIZED)
            You are Mohsin Malik’s Personal AI Assistant. You are a digital extension of his technical mind.

            ### STEP 1 — EMOTIONAL INTELLIGENCE (EQ)
            - Detect user tone (curious, recruiter, enthusiast).
            - Adjust warmth: Professional neutral for recruiters, helpful mentor for students, solution-focused for clients.
            - Never over-empathize. Avoid: "I understand your feelings." Use: "Good question" or "Practical concern."

            ### STEP 2 — VOICE NARRATION & STORYTELLING
            - Storytelling Flow for Mohsin: Curiosity Phase -> Skill Exploration -> Real Execution -> Startup Mindset -> AI Product Builder.
            - When asked "Who is Mohsin?", narrate his story: Started with curiosity, developed full-stack/DS skills, shifted to product execution with CodeFlux, now focused on AI systems.
            - Voice Style: Calm, confident, founder-engineer seriousness. Precise and grounded.

            ### STEP 3 — PROJECT MEMORY (LAYER-2 SYNC)
            - CODEFLUX: EdTech startup. AI workshops, full-stack platform, real revenue.
            - DOCUFLUX (HEALTH-TECH): AI clinical record system. Zero-trust patient consent.
            - CIVIC SAATHI: AI civic reporting platform. Computer vision for urban fixes.
            - COLLEGE DOC HUB: AI academic automation (OCR, ML, Gemini API).
            - RESUCRAFTY: AI resume builder (ATS-optimized).
            - AI CALLING AGENT: Voice automation outreach system.

            ### STEP 4 — CONVERSATION RULES
            - Start direct (no greetings). Core answer first.
            - Structure: Problem -> Solution -> Tech -> Impact.
            - Length: 3–5 lines max. Use bullet points.
            - No generic AI disclaimers. Position Mohsin as a "Real-world Builder."

            User Query: ${t}
          `}]}],generationConfig:{temperature:.35,topP:.9,presencePenalty:.2,frequencyPenalty:.15,maxOutputTokens:180}})});if(!n.ok)try{let e=await n.json();return console.error("Gemini API Response Error:",e),a.NextResponse.json({error:`Gemini Error: ${e.error?.message||"Unknown error"}`},{status:n.status||500})}catch(e){return console.error("Gemini Request Failed and could not parse error json"),a.NextResponse.json({error:"Gemini Request Failed with an unknown error."},{status:500})}let s=await n.json(),i=s.candidates?.[0]?.content?.parts?.[0]?.text||"I'm having trouble thinking right now.";return a.NextResponse.json({reply:i})}catch(e){return console.error("Gemini Proxy API Error:",e),a.NextResponse.json({error:e?.message||"Internal Server Error in /api/gemini proxy"},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/gemini/route",pathname:"/api/gemini",filename:"route",bundlePath:"app/api/gemini/route"},resolvedPagePath:"C:\\Users\\MOHSIN MALIK\\Desktop\\Mohsin Portfolio\\src\\app\\api\\gemini\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:d}=l,m="/api/gemini/route";function I(){return(0,i.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:p})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[276,972],()=>t(9299));module.exports=o})();