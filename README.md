# Carte de Visite Électronique Interactive - Souleymane Kone

Carte de visite numérique interactive, responsive et moderne avec génération de QR Code vCard dynamique et téléchargement de fichier `.vcf`.

---

## 🚀 Guide de déploiement sur Render.com

Render est une plateforme cloud idéale pour héberger gratuitement ce site statique avec un certificat SSL HTTPS automatique.

### Méthode 1 : Déploiement automatique (via Blueprint `render.yaml`)

1. Déposez ce projet sur votre compte **GitHub**, **GitLab** ou **Bitbucket**.
2. Connectez-vous sur [Render.com](https://dashboard.render.com/).
3. Cliquez sur **New +** (en haut à droite) et sélectionnez **Blueprint**.
4. Connectez votre dépôt Git.
5. Render détectera automatiquement le fichier `render.yaml` et configurera le **Static Site**.
6. Cliquez sur **Apply**. Votre site sera déployé et accessible en ligne en quelques secondes !

---

### Méthode 2 : Déploiement manuel sur Render.com

Si vous préférez configurer le service manuellement via l'interface web de Render :

1. Connectez-vous sur [Render Dashboard](https://dashboard.render.com/).
2. Cliquez sur le bouton **New +** puis choisissez **Static Site**.
3. Connectez le dépôt Git contenant les fichiers du projet.
4. Remplissez le formulaire avec les paramètres suivants :
   - **Name** : `souleymane-kone-vcard` (ou le nom souhaité)
   - **Branch** : `main` (ou votre branche principale)
   - **Root Directory** : (Laisser vide pour la racine)
   - **Build Command** : (Laisser vide)
   - **Publish Directory** : `.` (point pour signifier le répertoire courant)
5. Cliquez sur **Create Static Site**.
6. Une fois le build terminé, Render génèrera une URL publique sécurisée HTTPS (ex: `https://souleymane-kone-vcard.onrender.com`).

---

## 📱 Utilisation & Fonctionnalités

- **Contact Direct** : Boutons d'action rapide pour appeler, envoyer un email, ouvrir un chat WhatsApp ou enregistrer directement la fiche contact dans le répertoire mobile.
- **Fichier vCard (.vcf)** : Fichier `contact.vcf` standard 3.0 compatible iOS et Android.
- **QR Code Interactif** : Génération dynamique du QR Code contenant le vCard via modal pop-up.
- **Thème Visual Design** : Interface sombre (dark mode) avec accents bleu indigo et or.
