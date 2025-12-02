# 🤖 Agent Builder Mobile

A professional B2B SaaS mobile application for creating and managing AI agents, built with React Native, Expo, and Supabase with real-time synchronization.

## ✨ Features

- 📱 **Cross-Platform** - iOS, Android, and Web from a single codebase
- 🔄 **Real-time Sync** - Changes appear instantly across all devices
- ☁️ **Cloud Database** - PostgreSQL via Supabase
- 🔐 **Security Ready** - Row Level Security (RLS) enabled
- 🗃️ **Database Migrations** - Professional schema management
- 📊 **TypeScript** - Full type safety
- 🎨 **Modern UI** - Beautiful, intuitive interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Setup (4 Steps)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Supabase Anon Key:**
   - Visit: https://supabase.com/dashboard/project/gwylysqaitmekgpgyrqa/settings/api
   - Copy the "anon public" key
   - Update `src/config/supabase.ts` with your key

3. **Link Supabase project:**
   ```bash
   npm run supabase:link
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Start the app:**
   ```bash
   npm start
   ```

6. **Open on your device:**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS)

## 📱 Screenshots

### Home Screen
View all your AI agents in a beautiful list

### Create Agent
Build new agents with custom instructions and knowledge

### Real-time Updates
See changes instantly across all devices

## 🏗️ Architecture

```
React Native App (Expo)
        ↓
Supabase JavaScript Client
        ↓
Supabase Cloud (PostgreSQL + Realtime)
        ↓
Version-Controlled Migrations
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for detailed architecture documentation.

## 📂 Project Structure

```
agent-builder-mobile/
├── src/
│   ├── config/
│   │   └── supabase.ts              # Supabase configuration
│   ├── services/
│   │   └── StorageService.ts        # Data access layer
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Agent list
│   │   ├── CreateAgentScreen.tsx    # Create agents
│   │   └── AgentDetailScreen.tsx    # View/edit agents
│   ├── components/
│   │   └── AgentCard.tsx            # Agent list item
│   └── types/
│       └── Agent.ts                 # TypeScript types
│
├── supabase/
│   ├── config.toml                  # Supabase config
│   ├── seed.sql                     # Sample data
│   └── migrations/                  # Database migrations
│
└── Documentation/
    ├── QUICK_START.md               # Fast setup guide
    ├── MIGRATIONS.md                # Migration workflow
    ├── ARCHITECTURE.md              # System design
    └── SUPABASE_SETUP.md            # Supabase details
```

## 🔧 Available Scripts

### App Development
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### Database Management
```bash
npm run db:migrate       # Apply migrations to production
npm run db:status        # Check migration status
npm run db:diff          # See schema differences
npm run db:pull          # Pull remote schema
npm run db:reset         # Reset local database
npm run supabase:link    # Link to Supabase project
npm run supabase:start   # Start local Supabase (Docker)
npm run supabase:stop    # Stop local Supabase
```

## 🗃️ Database Schema

### Agents Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Agent name |
| `description` | TEXT | Brief description |
| `context` | TEXT | Context information |
| `instructions` | TEXT | Behavior instructions |
| `knowledge` | TEXT | Knowledge base |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update (auto) |

**Features:**
- Row Level Security enabled
- Real-time subscriptions enabled
- Automatic timestamp updates
- Performance indexes

See [`MIGRATIONS.md`](./MIGRATIONS.md) for migration details.

## 🔄 Real-time Features

The app uses Supabase real-time subscriptions to sync data instantly:

- **CREATE** - New agents appear on all devices immediately
- **UPDATE** - Changes sync across all screens in real-time
- **DELETE** - Deletions reflected everywhere instantly

```typescript
// Real-time subscription (implemented in HomeScreen)
StorageService.subscribeToAgents((payload) => {
  if (payload.eventType === 'INSERT') {
    // Add new agent to UI
  }
});
```

## 🔐 Security

### Current Setup (Development)
- Anonymous access enabled for easy testing
- Row Level Security (RLS) active
- All data protected by Supabase API keys

### Production Recommendations
1. **Add Authentication**
   ```sql
   ALTER TABLE agents ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```

2. **Update RLS Policies**
   ```sql
   CREATE POLICY "Users see own agents" ON agents
     FOR SELECT USING (auth.uid() = user_id);
   ```

3. **Enable Multi-tenancy**
   ```sql
   CREATE TABLE organizations (...);
   ALTER TABLE agents ADD COLUMN org_id UUID;
   ```

## 📊 Tech Stack

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local persistence

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database (v17)
- **PostgREST** - Auto-generated API
- **Realtime** - WebSocket pub/sub

### DevOps
- **Supabase CLI** - Database migrations
- **Git** - Version control
- **npm** - Package management

## 📚 Documentation

- [`QUICK_START.md`](./QUICK_START.md) - Get started in 4 steps
- [`MIGRATIONS.md`](./MIGRATIONS.md) - Database migration guide
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - System architecture
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Supabase configuration
- [`INTEGRATION_SUMMARY.md`](./INTEGRATION_SUMMARY.md) - Integration overview
- [`DATABASE_MIGRATIONS_SUMMARY.md`](./DATABASE_MIGRATIONS_SUMMARY.md) - Migration setup

## 🧪 Testing

### Manual Testing
1. Create an agent on Device A
2. Watch it appear on Device B in real-time
3. Update the agent on Device B
4. See changes on Device A instantly

### Future: Automated Testing
- Unit tests with Jest
- Integration tests with Testing Library
- E2E tests with Detox

## 🚀 Deployment

### Mobile App
- **Development:** Expo Go app
- **Production:** 
  - iOS: Submit to App Store
  - Android: Submit to Google Play
  - Web: Deploy to Vercel/Netlify

### Database
```bash
# Apply migrations to production
npm run db:migrate
```

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Deploy Database
  run: npm run db:migrate
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_TOKEN }}
```

## 🐛 Troubleshooting

### App won't connect to Supabase
- Check your anon key in `src/config/supabase.ts`
- Verify internet connection

### Database table doesn't exist
```bash
npm run db:status    # Check migration status
npm run db:migrate   # Apply pending migrations
```

### Real-time not working
- Verify realtime is enabled in Supabase dashboard
- Check browser/app console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code Style
- Use TypeScript
- Follow existing patterns
- Add comments for complex logic
- Update documentation

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic CRUD operations
- ✅ Real-time sync
- ✅ Database migrations
- ✅ Beautiful UI

### Phase 2: Authentication
- 🔜 User sign up/login
- 🔜 User-specific agents
- 🔜 Profile management

### Phase 3: Collaboration
- 🔜 Organization support
- 🔜 Team sharing
- 🔜 Role-based access

### Phase 4: Advanced Features
- 🔜 Agent templates
- 🔜 Version history
- 🔜 AI-powered suggestions
- 🔜 Analytics dashboard

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Amazing mobile development platform
- [Supabase](https://supabase.com/) - Excellent backend infrastructure
- [React Native](https://reactnative.dev/) - Powerful mobile framework

## 📞 Support

- **Documentation:** Check the `/docs` folder
- **Issues:** Open a GitHub issue
- **Supabase:** [Supabase Documentation](https://supabase.com/docs)

---

**Built with ❤️ for B2B SaaS**

Ready to build AI agents? Get started with [`QUICK_START.md`](./QUICK_START.md)!
