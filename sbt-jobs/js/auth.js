/**
 * SBT Jobs - Admin Authentication Logic (Vanilla JS)
 */

const auth = {
  checkSession() {
    // Check if logged in locally or via Supabase
    const logged = localStorage.getItem('sbt_admin_logged') === 'true';
    const email = localStorage.getItem('sbt_admin_email') || '';
    
    // Auto redirect to login if not authenticated on admin.html page
    const isEditingAdmin = window.location.pathname.includes('admin.html');
    if (isEditingAdmin && !logged) {
      window.location.href = 'login.html';
    }
    return { logged, email };
  },

  async login(email, password) {
    if (window.isSupabaseActive && window.supabaseClient) {
      // Real Supabase Auth login
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.user) {
        localStorage.setItem('sbt_admin_logged', 'true');
        localStorage.setItem('sbt_admin_email', data.user.email);
        return data.user;
      }
    } else {
      // Fallback local auth
      if (email.toLowerCase() === 'admin@sbt.com' && password === 'admin123') {
        localStorage.setItem('sbt_admin_logged', 'true');
        localStorage.setItem('sbt_admin_email', email);
        return { email };
      } else {
        throw new Error('Invalid credentials. Use admin@sbt.com / admin123.');
      }
    }
  },

  async logout() {
    if (window.isSupabaseActive && window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
    localStorage.removeItem('sbt_admin_logged');
    localStorage.removeItem('sbt_admin_email');
    window.location.href = 'index.html';
  }
};

window.SBT_AUTH = auth;
