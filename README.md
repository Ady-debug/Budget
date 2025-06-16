<h1>Budget Application Summary</h1> 

An application to allow calculations of monthly income and outgoings, providing a weekly spending allowance

<h2>Project Charter</h2>

- Code should be decoupled and orthogonal
- Code should be clear to read and easy to change/maintain
- Simplicity over complexity
- D.R.Y. where possible

<h2>Branching strategy</h2>

<h3>Branch Structure</h3>

- <code>Main</code> - Production ready code
- <code>Feature/[issue-number]-[short-description]</code> - Feature branch
- <code>Hotfix/[issue-number]-[short-description]</code> - Production fixes

<h3>Workflow Process</h3>
<h4>Feature Development</h4>

<code># Start from main
    git checkout main
    git pull origin main</code>

<code># Create feature branch
    git checkout -b feature/1-user-auth</code>
  
<code># Work on feature
    git add .
    got commit -m "feat: add user authentication - #1"</code>
    
<code># Push to remote
    git push -u origin feature/1-user-auth</code>

<code># Create Pull Request
    # - Go to Github -> Create PR
    # - From: feature/1-user-auth To: Main</code>

<code># Code review and approval
    # - Copilot Review
    # - Developer Review</code>

<code># MERGE
    # - "Merge Pull Request" through GitHub
    # - Choose merge type (squash and merge recommended)</code>

<code># Cleanup
    git checkout main
    git pull origin main # get merged changes
    git branch -d feature/1-user-auth # delete local branch
    git push origin --delete feature/1-user-auth # delete remote branch</code>

<h2>MVP Overview</h2>

<h3>Core Features</h3>

- User authentication
- Transaction Management Dashboard
    - Record Income
    - Record Fixed Expenditure
    - Record Flexible Expenditure
    - Present Full Budget
    - Present Surplus
    - Present Weekly Breakdown

<h3>Future Enhancements</h3>

- First time user flow
- Tooltips to help guide how to use the application
- Ability to track if items have been spent over the month
- Reporting on trends
- Email summaries
- AI integration to suggest ways to save in line with contextual guidelines

<h3>Tech Stack</h3>

- Frontend: React.js and Tailwind CSS
- API Layer: Node.js/Express RESTful API
- Database: PostgreSQL



  
  
  
