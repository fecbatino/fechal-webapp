-- ============================================================
-- 007_fixes.sql
-- ============================================================

-- ============================================================
-- 1. FIX: handle_new_user — full_name aus Registrierungsmetadaten speichern
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'user'
  );
  return new;
end;
$$;

-- ============================================================
-- 2. Familie erstellen (RPC)
--    Aufruf: supabase.rpc('create_family')
--    Gibt die neue family_id zurück.
--    Fehler wenn User bereits in einer Familie ist.
-- ============================================================
create or replace function public.create_family()
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  new_family_id uuid := gen_random_uuid();
begin
  if exists (
    select 1 from public.profiles
    where id = auth.uid() and family_id is not null
  ) then
    raise exception 'already_in_family';
  end if;

  update public.profiles
  set family_id = new_family_id,
      family_role = 'parent'
  where id = auth.uid();

  return new_family_id;
end;
$$;

revoke all on function public.create_family() from public;
grant execute on function public.create_family() to authenticated;

-- ============================================================
-- 3. Familie beitreten via ID (RPC)
--    Aufruf: supabase.rpc('join_family', { target_family_id: '...' })
--    Fehler wenn User bereits in einer Familie ist oder Familie nicht existiert.
-- ============================================================
create or replace function public.join_family(target_family_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if exists (
    select 1 from public.profiles
    where id = auth.uid() and family_id is not null
  ) then
    raise exception 'already_in_family';
  end if;

  if not exists (
    select 1 from public.profiles
    where family_id = target_family_id
  ) then
    raise exception 'family_not_found';
  end if;

  update public.profiles
  set family_id = target_family_id,
      family_role = 'member'
  where id = auth.uid();
end;
$$;

revoke all on function public.join_family(uuid) from public;
grant execute on function public.join_family(uuid) to authenticated;

-- ============================================================
-- 4. Familie verlassen (RPC)
--    Aufruf: supabase.rpc('leave_family')
-- ============================================================
create or replace function public.leave_family()
returns void language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles
  set family_id = null,
      family_role = 'member'
  where id = auth.uid();
end;
$$;

revoke all on function public.leave_family() from public;
grant execute on function public.leave_family() to authenticated;

-- ============================================================
-- 5. Admin-Promotion
--    Einmalig im Supabase SQL-Editor ausführen (nicht automatisiert):
--
--    update public.profiles
--    set role = 'admin'
--    where email = 'deine-email@beispiel.de';
--
-- ============================================================

-- ============================================================
-- 6. SEED: Arabisch-Karten — Grundvokabular (30 Karten)
-- ============================================================
insert into public.arabic_cards
  (arabic, transliteration, meaning_de, meaning_fr, meaning_en, category)
values
  -- Dikr & Gebet
  ('اللَّهُ أَكْبَرُ',              'Allahu Akbar',            'Allah ist der Größte',                        'Allah est le Plus Grand',                          'Allah is the Greatest',                   'prayer'),
  ('الْحَمْدُ لِلَّهِ',            'Alhamdulillah',           'Lob sei Allah',                               'Louange à Allah',                                  'All praise is due to Allah',               'prayer'),
  ('سُبْحَانَ اللَّهِ',            'Subhanallah',             'Allah sei gepriesen',                         'Gloire à Allah',                                   'Glory be to Allah',                        'prayer'),
  ('لَا إِلَهَ إِلَّا اللَّهُ',   'La ilaha illallah',       'Es gibt keinen Gott außer Allah',             'Il n''y a de dieu qu''Allah',                        'There is no god but Allah',                'prayer'),
  ('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', 'Bismillah ir-Rahman ir-Rahim', 'Im Namen Allahs, des Allerbarmers, des Barmherzigen', 'Au nom d''Allah, le Tout Miséricordieux, le Très Miséricordieux', 'In the name of Allah, the Most Gracious, the Most Merciful', 'prayer'),
  ('أَسْتَغْفِرُ اللَّهَ',         'Astaghfirullah',          'Ich bitte Allah um Vergebung',                'Je demande le pardon d''Allah',                    'I seek forgiveness from Allah',             'prayer'),

  -- Alltag
  ('إِنْ شَاءَ اللَّهُ',           'Inshallah',               'So Allah will',                               'Si Allah le veut',                                 'If Allah wills',                           'daily'),
  ('مَاشَاءَ اللَّهُ',             'Mashallah',               'Was Allah gewollt hat',                       'Ce qu''Allah a voulu',                             'What Allah has willed',                    'daily'),
  ('جَزَاكَ اللَّهُ خَيْرًا',      'Jazakallah Khairan',      'Möge Allah dich belohnen',                    'Qu''Allah te récompense',                          'May Allah reward you with good',           'daily'),
  ('السَّلَامُ عَلَيْكُمْ',        'As-salamu alaykum',       'Friede sei mit euch',                         'La paix soit sur vous',                            'Peace be upon you',                        'daily'),
  ('وَعَلَيْكُمُ السَّلَامُ',      'Wa alaykum as-salam',     'Und Friede sei auch mit euch',                'Et sur vous la paix',                              'And peace be upon you too',                'daily'),
  ('شُكْرًا',                      'Shukran',                 'Danke',                                       'Merci',                                            'Thank you',                                'daily'),
  ('نَعَمْ',                       'Naam',                    'Ja',                                          'Oui',                                              'Yes',                                      'daily'),
  ('لَا',                          'La',                      'Nein',                                        'Non',                                              'No',                                       'daily'),
  ('مَرْحَبًا',                    'Marhaban',                'Willkommen / Hallo',                          'Bienvenue / Bonjour',                              'Welcome / Hello',                          'daily'),
  ('مَعَ السَّلَامَة',             'Ma''a as-salamah',        'Auf Wiedersehen',                             'Au revoir',                                        'Goodbye',                                  'daily'),

  -- Gebet (Salah)
  ('الصَّلَاة',                    'as-Salah',                'Das Gebet',                                   'La prière',                                        'The prayer',                               'worship'),
  ('الْوُضُوء',                    'al-Wudu',                 'Die rituelle Waschung',                       'Les ablutions rituelles',                          'Ritual purification',                      'worship'),
  ('الرَّكْعَة',                   'ar-Rakah',                'Die Gebetseinheit',                           'L''unité de prière',                               'Prayer unit (rakah)',                       'worship'),
  ('الْقِبْلَة',                   'al-Qibla',                'Gebetsrichtung (Richtung Mekka)',              'Direction de la prière (vers La Mecque)',           'Prayer direction (towards Mecca)',          'worship'),
  ('السُّجُود',                    'as-Sujud',                'Die Niederwerfung',                           'La prosternation',                                 'Prostration',                              'worship'),
  ('الرُّكُوع',                    'ar-Ruku',                 'Die Verbeugung',                              'L''inclinaison',                                   'Bowing',                                   'worship'),

  -- Koran
  ('الْقُرْآن',                    'al-Quran',                'Der Koran',                                   'Le Coran',                                         'The Quran',                                'quran'),
  ('السُّورَة',                    'as-Surah',                'Die Korankapitel',                            'La sourate',                                       'The chapter',                              'quran'),
  ('الْآيَة',                      'al-Ayah',                 'Der Koranvers',                               'Le verset',                                        'The verse',                                'quran'),
  ('الْحِفْظ',                     'al-Hifz',                 'Das Auswendiglernen',                         'La mémorisation',                                  'Memorization',                             'quran'),

  -- Hajj
  ('الْحَجّ',                      'al-Hajj',                 'Die große Pilgerfahrt',                       'Le grand pèlerinage',                              'The major pilgrimage',                     'hajj'),
  ('الْعُمْرَة',                   'al-Umrah',                'Die kleine Pilgerfahrt',                      'Le petit pèlerinage',                              'The minor pilgrimage',                     'hajj'),
  ('الْإِحْرَام',                  'al-Ihram',                'Der Pilgerzustand',                           'L''état de sacralisation',                         'The state of consecration',                'hajj'),
  ('الطَّوَاف',                    'at-Tawaf',                'Umrundung der Kaaba (7x)',                    'Circumambulation de la Kaaba (7x)',                 'Circumambulation of the Kaaba (7x)',        'hajj')

on conflict do nothing;
