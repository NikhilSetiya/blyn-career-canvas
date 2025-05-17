
-- Schema for Blyn Database

-- Users table (extends the built-in auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  intent TEXT CHECK (intent IN ('job_hunt', 'freelance', 'founder', 'personal_branding')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarded BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  source_type TEXT CHECK (source_type IN ('upload', 'linkedin', 'qna')),
  original_file_url TEXT,
  extracted_data JSONB,
  final_cv_text TEXT,
  version_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Cover letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT,
  company TEXT,
  input_jd_text TEXT,
  final_letter_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Portfolio sites table
CREATE TABLE IF NOT EXISTS public.portfolio_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT CHECK (theme IN ('dev', 'pm', 'marketer', 'founder', 'business')),
  final_html_url TEXT,
  editable_copy JSONB,
  subdomain TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_sites ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users policies
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Resumes policies
CREATE POLICY "Users can view their own resumes" 
  ON public.resumes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" 
  ON public.resumes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
  ON public.resumes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
  ON public.resumes 
  FOR DELETE USING (auth.uid() = user_id);

-- Cover letters policies
CREATE POLICY "Users can view their own cover letters" 
  ON public.cover_letters 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters" 
  ON public.cover_letters 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters" 
  ON public.cover_letters 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters" 
  ON public.cover_letters 
  FOR DELETE USING (auth.uid() = user_id);

-- Portfolio sites policies
CREATE POLICY "Users can view their own portfolio sites" 
  ON public.portfolio_sites 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio sites" 
  ON public.portfolio_sites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio sites" 
  ON public.portfolio_sites 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio sites" 
  ON public.portfolio_sites 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a user record when a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
