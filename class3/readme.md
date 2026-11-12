

# Subagents Architecture (Explore, Plan, Custom)

- Own context window   
- Own system prompt   
- Own tools   
- Own permission  

# Concerency vs Parallelism

Built-in subagents (auto-invoked):
- Explore -> fast, read-only. File search / codebase discovery.[cite: 2]
- Plan -> Plan mode e strategy deyar aage context gather kore.[cite: 2]
- General-purpose -> explore + modify[cite: 2]
- statusline setup[cite: 2]
- Explore and plan skips claude.md. Other subagents don't skip claude.md[cite: 2]

Custom subagents:
- File location: .claude/agents/ (project) OR ~/.claude/agents/ (global).[cite: 2]
- Format: Markdown + YAML frontmatter -> name, description, tools, model.[cite: 2]
- description is the most important part. it should be action oriented.[cite: 2]
  e.g.: MUST BE USED for security review[cite: 2]
- Subagent's system prompt replaces Claude Code's default prompt completely[cite: 2]
- /agents shows configured agent list.[cite: 2]


Statusline subagent

# Documentation StatusLine


Can you please give me some nice sub agent ideas for this project? dont overr engineering


# /code-review can you please review my codebase


# Sub agent

Can you please create a code review subagent? must be used for security review

# Sub agent understand terminal


# 2. Context management Strategies

Best Practice follow

/context

System Promt
System tools
Custom agnets
Skills
Message
Free space

/rewind wrong path

/memory

# 4. Refector Legacy Code

Flow

Explore
Plan mode
Safety net
Incremental
claude.md