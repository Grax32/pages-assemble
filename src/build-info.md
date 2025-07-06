---
layout: pages
title: Build Information
---

# Build Information

<div class="build-info">
  <h2>🔧 System Information</h2>
  <ul>
    <li><strong>Build Time:</strong> {{ build-info.buildTime }}</li>
    <li><strong>Node Version:</strong> {{ build-info.nodeVersion }}</li>
    <li><strong>Platform:</strong> {{ build-info.platform }} ({{ build-info.arch }})</li>
  </ul>

  <h2>📦 Package Information</h2>
  <ul>
    <li><strong>Name:</strong> {{ build-info.package.name }}</li>
    <li><strong>Version:</strong> {{ build-info.package.version }}</li>
    <li><strong>Description:</strong> {{ build-info.package.description }}</li>
  </ul>

  <h2>🔗 Git Information</h2>
  <ul>
    <li><strong>Branch:</strong> {{ build-info.git.branch }}</li>
    <li><strong>Commit:</strong> <code>{{ build-info.git.commitShort }}</code></li>
    <li><strong>Full Commit:</strong> <code>{{ build-info.git.commit }}</code></li>
    <li><strong>Has Changes:</strong> {{ "Yes" if build-info.git.isDirty else "No" }}</li>
    {% if build-info.github %}
    <li><strong>GitHub:</strong> <a href="{{ build-info.github.url }}" target="_blank">{{ build-info.github.owner }}/{{ build-info.github.repo }}</a></li>
    {% endif %}
  </ul>

  <h2>📋 Raw Build Data</h2>
  <details>
    <summary>Click to expand raw JSON</summary>
    <pre><code>{% buildinfo %}</code></pre>
  </details>
</div>

<style>
.build-info {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-family: system-ui, -apple-system, sans-serif;
}

.build-info h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.build-info ul {
  list-style: none;
  padding: 0;
}

.build-info li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ecf0f1;
}

.build-info code {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.build-info pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 0.9rem;
}

.build-info details {
  margin-top: 1rem;
}

.build-info summary {
  cursor: pointer;
  padding: 0.5rem;
  background: #3498db;
  color: white;
  border-radius: 3px;
  margin-bottom: 1rem;
}
</style>
