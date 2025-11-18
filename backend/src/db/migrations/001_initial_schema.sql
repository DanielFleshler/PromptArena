-- ============================================
-- StarScout Database Schema
-- Migration 001: Initial Setup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: analyses
-- Purpose: Track each GitHub profile analysis request
-- ============================================
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  total_repos INTEGER,
  processed_repos INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  CONSTRAINT check_progress CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT check_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Index for looking up by username
CREATE INDEX idx_analyses_username ON analyses(username);

-- Index for finding recent analyses
CREATE INDEX idx_analyses_created ON analyses(created_at DESC);

-- ============================================
-- Table: jobs
-- Purpose: Job queue - stores all tasks to be processed
-- ============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 5,
  data JSONB,
  result JSONB,
  error TEXT,
  retries INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  CONSTRAINT check_priority CHECK (priority >= 1 AND priority <= 10),
  CONSTRAINT check_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Critical index for queue operations (get next highest priority job)
CREATE INDEX idx_jobs_queue ON jobs(status, priority DESC, created_at ASC);

-- Index for finding jobs by analysis
CREATE INDEX idx_jobs_analysis ON jobs(analysis_id);

-- ============================================
-- Table: repositories
-- Purpose: Store analyzed repository data
-- ============================================
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- GitHub stats
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  is_fork BOOLEAN DEFAULT false,

  -- Language info
  primary_language VARCHAR(100),
  languages JSONB,

  -- Analysis results
  lines_of_code INTEGER,
  has_readme BOOLEAN DEFAULT false,
  readme_score INTEGER,
  has_tests BOOLEAN DEFAULT false,
  has_ci BOOLEAN DEFAULT false,
  has_license BOOLEAN DEFAULT false,
  last_commit_date TIMESTAMP,

  -- Portfolio ranking
  portfolio_score INTEGER,

  -- Detailed metrics
  metrics JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT check_readme_score CHECK (readme_score >= 0 AND readme_score <= 100),
  CONSTRAINT check_portfolio_score CHECK (portfolio_score >= 0 AND portfolio_score <= 100)
);

-- Index for finding repos by analysis
CREATE INDEX idx_repos_analysis ON repositories(analysis_id);

-- Index for sorting by portfolio score
CREATE INDEX idx_repos_score ON repositories(portfolio_score DESC);

-- ============================================
-- Table: results
-- Purpose: Final portfolio generation output
-- ============================================
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE UNIQUE,

  -- Portfolio data
  portfolio_data JSONB NOT NULL,

  -- Exports
  export_json TEXT,
  export_markdown TEXT,
  export_html TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for finding result by analysis
CREATE INDEX idx_results_analysis ON results(analysis_id);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to analyses table
CREATE TRIGGER analyses_updated_at
BEFORE UPDATE ON analyses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Apply trigger to repositories table
CREATE TRIGGER repositories_updated_at
BEFORE UPDATE ON repositories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Verification
-- ============================================

-- Show all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
