export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>Portfolio API Running</h1>
      <p>Backend API for Geetesh Vaity portfolio</p>
      <h2>Available Endpoints:</h2>
      <h3>Authentication</h3>
      <ul>
        <li>POST /api/auth/login</li>
        <li>POST /api/auth/logout</li>
      </ul>
      <h3>Projects</h3>
      <ul>
        <li>GET /api/projects</li>
        <li>POST /api/projects</li>
        <li>PUT /api/projects/[id]</li>
        <li>DELETE /api/projects/[id]</li>
      </ul>
      <h3>Skills</h3>
      <ul>
        <li>GET /api/skills</li>
        <li>POST /api/skills</li>
        <li>PUT /api/skills/[id]</li>
        <li>DELETE /api/skills/[id]</li>
      </ul>
    </div>
  )
}
