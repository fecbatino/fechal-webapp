-- Migration 008: ADD MISSING RLS POLICIES
-- 2026-06-10
-- Ergänzt fehlende UPDATE/DELETE Policies für family_events, family_notes, 
-- user_card_progress, quran_progress und admin-Write auf arabic_cards

-- 1. family_events: UPDATE (family members can edit)
CREATE POLICY "family_members_update_events"
  ON family_events FOR UPDATE
  USING (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));

-- 2. family_notes: UPDATE (family members can edit)
CREATE POLICY "family_members_update_notes"
  ON family_notes FOR UPDATE
  USING (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));

-- 3. user_card_progress: DELETE (own progress)
CREATE POLICY "users_delete_own_card_progress"
  ON user_card_progress FOR DELETE
  USING (user_id = auth.uid());

-- 4. quran_progress: DELETE (own progress)
CREATE POLICY "users_delete_own_quran_progress"
  ON quran_progress FOR DELETE
  USING (user_id = auth.uid());

-- 5. arabic_cards: Admin INSERT/UPDATE/DELETE
CREATE POLICY "admin_insert_arabic_cards"
  ON arabic_cards FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admin_update_arabic_cards"
  ON arabic_cards FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admin_delete_arabic_cards"
  ON arabic_cards FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. profiles: Admin UPDATE (role management)
CREATE POLICY "admin_update_profiles"
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));