# Connecting the forms to enhancly@gmail.com

The website is plain HTML/CSS/JS with no server, so it can't send email by
itself. Both forms (Contact Us and the Careers application form) are wired
to use **Formspree** — a free service that receives a form submission and
forwards it straight to your inbox. You need to activate this once.

## One-time setup (about 5 minutes)

1. Go to **https://formspree.io** and click **Sign up** (free plan is enough
   for normal volumes — 50 submissions/month).
2. Sign up using **enhancly@gmail.com** so submissions land in that inbox.
3. Click **+ New Form**, name it e.g. "Enhancly Website", and confirm.
4. Formspree will show you an endpoint that looks like:
   `https://formspree.io/f/abcdwxyz`
   Copy that URL.
5. Open these two files in the website folder and replace
   `REPLACE_WITH_YOUR_FORMSPREE_ID` with your real form ID
   (keep the `https://formspree.io/f/` part, just swap the ID at the end):

   - `contact.html` — search for `action="https://formspree.io/f/...`
   - `careers.html` — search for `action="https://formspree.io/f/...`

   You can use the **same** form ID in both files — every submission
   already includes a hidden `_subject` field ("New Contact Us Enquiry"
   or "New Job Application") so you can tell them apart in your inbox.

6. Formspree will send a confirmation email to enhancly@gmail.com the
   first time each form is submitted from the live site — click the
   confirmation link to activate delivery. After that, submissions go
   straight through with no further action needed.

## What happens if you skip this step

The site still works — nothing breaks. But until a real Formspree ID is in
place, submitting either form will show the visitor a message asking them
to email enhancly@gmail.com directly, instead of sending automatically.

## Notes

- The Contact Us form's **Company / Organisation** field is now required —
  visitors can't submit without filling it in.
- Each submission is emailed with the visitor's name, email, and message
  as plain fields; you can reply directly from the notification email
  since Formspree sets the visitor's address as reply-to automatically.
- If you outgrow the free tier or want a submissions dashboard/spam
  filtering, Formspree's paid plans (or alternatives like Getform,
  Web3Forms) work the same way — just swap the `action` URL.
