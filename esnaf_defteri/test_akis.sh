#!/bin/bash
BASE="http://127.0.0.1:8000/api"

echo "=== 1) REGISTER ==="
REGISTER_RESPONSE=$(curl -s -X POST $BASE/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"ad_soyad":"Test Esnaf","telefon":"5551234567","password":"Test1234!"}')
echo $REGISTER_RESPONSE
ACCESS=$(echo $REGISTER_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('access',''))")

if [ -z "$ACCESS" ]; then
  echo "!!! Register token dönmedi, login deniyorum..."
  LOGIN_RESPONSE=$(curl -s -X POST $BASE/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"telefon":"5551234567","password":"Test1234!"}')
  echo $LOGIN_RESPONSE
  ACCESS=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('access',''))")
fi

echo ""
echo "ACCESS TOKEN: $ACCESS"
echo ""

AUTH="Authorization: Bearer $ACCESS"

echo "=== 2) MÜŞTERİ EKLE ==="
MUSTERI_RESPONSE=$(curl -s -X POST $BASE/musteriler/ \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"ad_soyad":"Ahmet Yılmaz","telefon":"5559876543","adres":"Test Mah.","not_alani":"test notu"}')
echo $MUSTERI_RESPONSE
MUSTERI_ID=$(echo $MUSTERI_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
echo "MUSTERI_ID: $MUSTERI_ID"
echo ""

echo "=== 3) İŞ KAYDI EKLE ==="
ISKAYDI_RESPONSE=$(curl -s -X POST $BASE/is-kayitlari/ \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"musteri\":$MUSTERI_ID,\"yapilan_is\":\"Klima bakımı\",\"ucret\":\"500.00\",\"durum\":\"tamamlandi\",\"tarih\":\"2026-07-05\"}")
echo $ISKAYDI_RESPONSE
ISKAYDI_ID=$(echo $ISKAYDI_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
echo "ISKAYDI_ID: $ISKAYDI_ID"
echo ""

echo "=== 4) MÜŞTERİ LİSTESİ (borç görünüyor mu) ==="
curl -s -X GET $BASE/musteriler/ -H "$AUTH"
echo ""
echo ""

echo "=== 5) İŞ KAYDI DETAY ==="
curl -s -X GET $BASE/is-kayitlari/$ISKAYDI_ID/ -H "$AUTH"
echo ""
echo ""

echo "=== 6) ABONELİK DURUMU ==="
curl -s -X GET $BASE/abonelik/durum/ -H "$AUTH"
echo ""
echo ""

echo "=== 7) ÖDEME TALEP ET ==="
curl -s -X POST $BASE/abonelik/odeme-talep-et/ \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"plan":"aylik"}'
echo ""
