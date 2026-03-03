-- Crêpe Time Tunisia — Realtime + Email Logs
-- Enables Supabase Realtime on orders + table for email failure tracking

-- ============================================
-- ENABLE REALTIME ON ORDERS
-- ============================================
-- Allows admin dashboard to subscribe to postgres_changes (INSERT/UPDATE)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%already%' AND SQLERRM NOT LIKE '%member%' THEN
      RAISE;
    END IF;
END $$;

-- ============================================
-- EMAIL LOGS (for failed Resend sends)
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,  -- 'order_confirmation', 'status_update'
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL,     -- 'sent', 'failed'
  error_message TEXT,       -- populated on failure
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_order ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_logs_service" ON email_logs FOR ALL USING (true);
