-- Create the action_items table
CREATE TABLE public.action_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notebook_id uuid REFERENCES public.notebooks(id) ON DELETE CASCADE NOT NULL,
  action_text text NOT NULL,
  is_completed boolean DEFAULT FALSE NOT NULL
);

-- Enable Row Level Security (RLS) for the action_items table
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own action items
CREATE POLICY "Users can view their own action items" ON public.action_items
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to create their own action items
CREATE POLICY "Users can create their own action items" ON public.action_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own action items
CREATE POLICY "Users can update their own action items" ON public.action_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own action items
CREATE POLICY "Users can delete their own action items" ON public.action_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to update the 'updated_at' timestamp automatically
CREATE TRIGGER update_action_items_updated_at
  BEFORE UPDATE ON public.action_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
