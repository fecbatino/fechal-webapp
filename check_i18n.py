import json

keys = {}
for lang in ['de', 'en', 'fr', 'ar']:
    with open(f'messages/{lang}.json') as f:
        d = json.load(f)
    p = d.get('portfolio', {})
    keys[lang] = set(p.keys())

base = keys['de']
all_match = True
for lang in ['en', 'fr', 'ar']:
    if keys[lang] != base:
        missing = base - keys[lang]
        extra = keys[lang] - base
        print(f'{lang}: MISSING={missing}, EXTRA={extra}')
        all_match = False

if all_match:
    print('✅ ALL 4 LOCALES: 100% key match — deviation metric = 0')
else:
    print('⚠️  KEY MISMATCH FOUND')

print(f'DE: {len(keys["de"])} keys')
print(f'EN: {len(keys["en"])} keys')
print(f'FR: {len(keys["fr"])} keys')
print(f'AR: {len(keys["ar"])} keys')

# Show any difference
print("\nDE keys (sorted):")
for k in sorted(base):
    print(f"  {k}")