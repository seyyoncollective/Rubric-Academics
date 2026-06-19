
CREATE TABLE public.faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculties TO anon, authenticated;
GRANT ALL ON public.faculties TO service_role;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public faculties access" ON public.faculties FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon, authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public students access" ON public.students FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.faculty_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (faculty_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty_students TO anon, authenticated;
GRANT ALL ON public.faculty_students TO service_role;
ALTER TABLE public.faculty_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public faculty_students access" ON public.faculty_students FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present','absent')),
  recorded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO anon, authenticated;
GRANT ALL ON public.attendance_records TO service_role;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public attendance access" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_attendance_faculty_date ON public.attendance_records(faculty_id, date);

-- Seed faculties
INSERT INTO public.faculties (name) VALUES
('Nanditha'),('Anitha Priya'),('Bhavadharani'),('Haritha'),('Saraswathy'),('Rajameenal')
ON CONFLICT (name) DO NOTHING;

-- Seed students
INSERT INTO public.students (name) VALUES
('Mivisha'),('Pushpendra'),('Kavin'),('Hanisha'),('Praneesh'),('Kabilan'),('Nitish'),
('Yazhiniyan'),('Samudra'),('Anugraha'),('Sangeetha'),('Hari'),('Krish'),('Yazhini'),
('Sanjay'),('Nithya'),('Vishnuvardhan'),('Santhosh'),('Yamunash'),('Kanish'),('Rakshitha'),
('Rakshan'),('Varunesh'),('Vismithaa Sri'),('Mahati Sri'),('Bhuvanesh'),('Sujan'),('Karan'),
('Nandini'),('Satvika'),('Deva'),('Mahibalan'),('Dhikshana'),('Yazhini (UKG)'),('Joannah'),
('Balamurugan'),('Varunika'),('Baghyalakshmi'),('Daiwik'),('Sri Sahasra'),('Pannpaa');
