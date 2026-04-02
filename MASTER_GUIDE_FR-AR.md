# 🧇 Crêpe Time Tunisia — Maître Guide de Gestion

---

## 📖 TABLE DES MATIÈRES | جدول المحتويات

### 🇫🇷 Français
1. [Vue d'ensemble](#vue-densemble-fr)
2. [Gestion du Restaurant](#gestion-du-restaurant-fr)
3. [Gestion des Commandes](#gestion-des-commandes-fr)
4. [Analytics & Performance](#analytics--performance-fr)
5. [Support & Dépannage](#support--dépannage-fr)

### 🇸🇦 العربية
1. [نظرة عامة](#نظرة-عامة-ar)
2. [إدارة المطعم](#إدارة-المطعم-ar)
3. [إدارة الطلبات](#إدارة-الطلبات-ar)
4. [التحليلات والأداء](#التحليلات-والأداء-ar)
5. [الدعم والاستكشاف](#الدعم-والاستكشاف-ar)

---

# 🇫🇷 FRANÇAIS

## Vue d'Ensemble FR

### Qu'est-ce que Crêpe Time Tunisia ?

Crêpe Time Tunisia est une **plateforme de gestion de restaurant complète et moderne** qui vous permet de :

- ✅ **Gérer votre menu** — ajouter, modifier, supprimer des crêpes avec photos et prix
- ✅ **Traiter les commandes** — voir les commandes en temps réel, tracker la livraison
- ✅ **Analytics** — suivre vos ventes, revenus, clients
- ✅ **Notifications** — recevoir les commandes via WhatsApp instantanément
- ✅ **Livraison** — gérer la livraison à domicile et retrait en boutique

### Architecture

```
┌─────────────────────┐
│  App Client         │  (crepetime.tn — React/Vite)
│  Commandes, Menu    │
└──────────┬──────────┘
           │ HTTPS
┌──────────▼──────────┐
│  API Backend        │  (Express/Node)
│  /api/restaurant    │
│  /api/order         │
│  /api/menu          │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Supabase           │  (PostgreSQL + Auth)
│  Base de données    │
│  Authentification   │
└─────────────────────┘
```

---

## Gestion du Restaurant FR

### 📱 Accès Admin

**URL**: `https://crepetime.tn/manage-restaurant`

**Authentification**:
1. Cliquez sur **"Connexion"** en haut à droite
2. Entrez votre email admin
3. Entrez votre mot de passe
4. Vous serez redirigé vers votre **Tableau de Bord Admin**

### 🍽️ Gestion du Menu

#### Ajouter un Item au Menu

1. Allez à **Manage Restaurant** → **Menu Section**
2. Cliquez sur **"+ Ajouter un plat"**
3. Remplissez :
   - **Nom** : ex. "Crêpe Nutella Banane"
   - **Prix** : ex. "1200" (dinars tunisiens)
   - **Catégorie** : Crêpes, Desserts, Français
   - **Photo** : Uploadez une image haute qualité (JPG/PNG, min 800×600px)
   - **Description** (optionnel) : "Crêpe sucrée avec Nutella et banane fraîche"
4. Cliquez **"Sauvegarder"**

#### Modifier un Item

1. Cliquez sur le plat existant dans votre menu
2. Modifiez les champs
3. Cliquez **"Mettre à jour"**

#### Supprimer un Item

1. Trouvez le plat
2. Cliquez l'icône **Poubelle** 🗑️
3. Confirmez la suppression

**💡 Conseil** : Gardez les photos de haute qualité — elles augmentent les commandes de 40 % !

### 📊 Détails du Restaurant

Dans **Manage Restaurant** → **Details Section** :

- **Nom du restaurant** : "Crêpe Time Tunisia" (non modifiable)
- **Ville** : "Nabeul" (non modifiable)
- **Temps de livraison estimé** : ex. "30" minutes
- **Logo/Image** : Photo de couverture (fond blanc recommandé)
- **Cuisines** : Crêpes, Desserts, Français

---

## Gestion des Commandes FR

### 📦 Suivi des Commandes

**URL**: `https://crepetime.tn/order-status`

#### Types de Commandes

| Statut | Signification | Action |
|--------|---------------|--------|
| **Placed** | Commande reçue | Vérifier les détails |
| **Confirmed** | Confirmée par le resto | Commencer la préparation |
| **In Progress** | En préparation | Informer le client si délai |
| **Out for Delivery** | En livraison | Contact driver + client |
| **Delivered** | Livrée | Clôture automatique |

#### Workflow Commande Complète

```
1. CLIENT PASSE COMMANDE
        ↓
2. VOUS RECEVEZ NOTIFICATION WhatsApp
   "Nouvelle commande : 3 Crêpes Nutella, 1 Dessert"
        ↓
3. VOUS ACCEPTEZ/REJETEZ
        ↓
4. SI ACCEPTÉE → "Confirmed"
        ↓
5. VOUS PRÉPAREZ (10-20 min)
        ↓
6. VOUS MARQUAZ "In Progress"
        ↓
7. DRIVER RÉCUPÈRE
        ↓
8. VOUS MARQUAZ "Out for Delivery"
        ↓
9. CLIENT REÇOIT
        ↓
10. SYSTÈME MARQUE "Delivered"
```

### 🔔 Notifications WhatsApp

Vous recevez **automatiquement** un message WhatsApp pour :

- ✅ Chaque nouvelle commande
- ✅ Changements de statut
- ✅ Demandes clients spéciales

**Configuration** : Aucune — elle fonctionne automatiquement avec votre numéro de restaurant enregistré.

---

## Analytics & Performance FR

### 📈 Dashboard Analytique

**URL**: `https://crepetime.tn/business-insights`

#### Métriques Clés

1. **Commandes Totales** — nombre de commandes ce mois
2. **Revenu Total** — dinars gagnés
3. **Panier Moyen** — montant moyen par commande
4. **Client Récurrent** — % de clients qui reviennent
5. **Heure Pic** — quand vous recevez le plus de commandes

#### Optimisation

**Allez à** → **Performance** → **Recommendations**

Tips pour augmenter les ventes :
- 🥞 Ajouter des photos de qualité
- 💰 Ajuster les prix selon la concurrence
- ⏱️ Garantir livraison sous 30 min
- ⭐ Encourager les avis clients

---

## Support & Dépannage FR

### ❓ FAQ

**Q: Je n'ai pas reçu la commande par WhatsApp**
A: Vérifier que vous êtes connecté en tant qu'admin. Relancer l'app.

**Q: Comment ajouter plus de cuisines ?**
A: Contactez l'équipe support — les catégories sont gérées par admin système.

**Q: Puis-je modifier la ville ?**
A: Non, Nabeul est fixée. Contactez support si vous changez de localisation.

---

# 🇸🇦 العربية

## نظرة عامة AR

### ما هو تطبيق Crêpe Time Tunisia ?

Crêpe Time Tunisia هو **نظام إدارة مطاعم حديث وكامل** يسمح لك بـ :

- ✅ **إدارة القائمة** — إضافة وتعديل وحذف الكريب مع الصور والأسعار
- ✅ **معالجة الطلبات** — عرض الطلبات في الوقت الفعلي وتتبع التوصيل
- ✅ **التحليلات** — تتبع المبيعات والإيرادات والعملاء
- ✅ **الإخطارات** — استقبال الطلبات عبر WhatsApp فوراً
- ✅ **التوصيل** — إدارة التوصيل إلى المنزل والاستلام من المتجر

### البنية التحتية

```
┌──────────────────┐
│  تطبيق العميل   │  (crepetime.tn — React/Vite)
│  الطلبات والقائمة│
└────────┬─────────┘
         │ HTTPS
┌────────▼─────────┐
│  API الخادم      │  (Express/Node)
│  /api/restaurant │
│  /api/order      │
│  /api/menu       │
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Supabase        │  (PostgreSQL + المصادقة)
│  قاعدة البيانات │
└──────────────────┘
```

---

## إدارة المطعم AR

### 📱 الوصول الإداري

**الرابط**: `https://crepetime.tn/manage-restaurant`

**المصادقة**:
1. انقر على **"تسجيل الدخول"** في الأعلى اليمين
2. أدخل بريدك الإداري
3. أدخل كلمة المرور
4. سيتم إعادة توجيهك إلى **لوحة التحكم الإدارية**

### 🍽️ إدارة القائمة

#### إضافة عنصر إلى القائمة

1. اذهب إلى **Manage Restaurant** → **Menu Section**
2. انقر **"+ أضف طبق"**
3. أكمل :
   - **الاسم** : مثل "كريب نوتيلا موز"
   - **السعر** : مثل "1200" (دينار تونسي)
   - **الفئة** : كريب، حلويات، فرنسي
   - **الصورة** : ارفع صورة عالية الجودة (JPG/PNG، بحد أدنى 800×600px)
   - **الوصف** (اختياري) : "كريب حلو مع نوتيلا وموز طازج"
4. انقر **"حفظ"**

#### تعديل عنصر

1. انقر على الطبق الموجود في القائمة
2. عدّل الحقول
3. انقر **"تحديث"**

#### حذف عنصر

1. ابحث عن الطبق
2. انقر أيقونة **سلة المهملات** 🗑️
3. أكد الحذف

**💡 نصيحة** : احتفظ بصور عالية الجودة — فهي تزيد الطلبات بنسبة 40 % !

### 📊 تفاصيل المطعم

في **Manage Restaurant** → **Details Section** :

- **اسم المطعم** : "Crêpe Time Tunisia" (غير قابل للتعديل)
- **المدينة** : "نابل" (غير قابلة للتعديل)
- **وقت التوصيل المتوقع** : مثل "30" دقيقة
- **الشعار/الصورة** : صورة الغلاف (خلفية بيضاء مقترحة)
- **الأطباق** : كريب، حلويات، فرنسي

---

## إدارة الطلبات AR

### 📦 تتبع الطلبات

**الرابط**: `https://crepetime.tn/order-status`

#### أنواع الطلبات

| الحالة | المعنى | الإجراء |
|--------|--------|--------|
| **Placed** | تم استقبال الطلب | تحقق من التفاصيل |
| **Confirmed** | تم التأكيد من المطعم | بدء التحضير |
| **In Progress** | قيد التحضير | أخبر العميل إن تأخر |
| **Out for Delivery** | قيد التوصيل | تواصل مع السائق والعميل |
| **Delivered** | تم التوصيل | إغلاق تلقائي |

#### سير عمل الطلب الكامل

```
1. العميل يضع الطلب
        ↓
2. تتلقى إخطار WhatsApp
   "طلب جديد: 3 كريب نوتيلا، 1 حلوى"
        ↓
3. تقبل أو ترفض
        ↓
4. إذا وافقت → "Confirmed"
        ↓
5. تحضّر (10-20 دقيقة)
        ↓
6. تحدّث إلى "In Progress"
        ↓
7. السائق يستلم
        ↓
8. تحدّث إلى "Out for Delivery"
        ↓
9. العميل يستقبل
        ↓
10. النظام يحدّث إلى "Delivered"
```

### 🔔 إخطارات WhatsApp

تتلقى **تلقائياً** رسالة WhatsApp لـ :

- ✅ كل طلب جديد
- ✅ تغييرات الحالة
- ✅ طلبات خاصة من العملاء

**الإعداد** : لا شيء يلزم — يعمل تلقائياً برقم مطعمك المسجل.

---

## التحليلات والأداء AR

### 📈 لوحة التحليلات

**الرابط**: `https://crepetime.tn/business-insights`

#### المقاييس الأساسية

1. **إجمالي الطلبات** — عدد الطلبات هذا الشهر
2. **الإيرادات الإجمالية** — الدنانير المكتسبة
3. **متوسط السلة** — المبلغ المتوسط لكل طلب
4. **العميل المتكرر** — نسبة العملاء الذين يعودون
5. **وقت الذروة** — متى تستقبل أكثر الطلبات

#### التحسين

اذهب إلى → **Performance** → **Recommendations**

نصائح لزيادة المبيعات :
- 🥞 أضف صور عالية الجودة
- 💰 اضبط الأسعار حسب المنافسة
- ⏱️ اضمن توصيل تحت 30 دقيقة
- ⭐ شجّع تقييمات العملاء

---

## الدعم والاستكشاف AR

### ❓ الأسئلة الشائعة

**س: لم أستقبل الطلب عبر WhatsApp**
ج: تأكد أنك مسجل دخول كمسؤول. أعد تشغيل التطبيق.

**س: كيف أضيف المزيد من الأطباق؟**
ج: تواصل مع فريق الدعم — الفئات تُدار من قبل المسؤول النظام.

**س: هل يمكنني تغيير المدينة؟**
ج: لا، نابل محددة. تواصل مع الدعم إذا انتقلت للموقع.

---

## 📞 الاتصال

- **البريد الإلكتروني** : support@crepetime.tn
- **WhatsApp** : +216-XX-XXX-XXX
- **الموقع** : https://crepetime.tn
- **ساعات العمل** : 10:00 - 23:00 يومياً

---

**آخر تحديث** : 2026-04-03
**النسخة** : 1.0.0 (Production Ready)
