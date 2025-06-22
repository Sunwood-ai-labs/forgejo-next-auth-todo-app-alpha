"use client";

import React from 'react'; // useEffect, useState は不要になる
import Head from 'next/head';
// useRouter は AuthProvider が担当するので不要になる場合が多い
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import TodoApp from '@/components/TodoApp';

export default function DashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  // AuthProviderがリダイレクトとローディングを処理するため、
  // このページに到達した時点で isLoading=false かつ isAuthenticated=true であることが期待される。
  // ただし、念のためローディング状態とuserの存在をチェックする。
  if (isLoading || !user) {
    // !isAuthenticated もチェック条件に含めても良いが、AuthProviderのリダイレクトを信頼するならuserの存在で十分
    return <LoadingSpinner message="ユーザー情報を読み込み中..." />;
  }

  // もしAuthProviderのリダイレクトが間に合わず、一瞬未認証でこのページが表示されるのを防ぐため
  // (通常はAuthProvider内のuseEffectで処理されるはず)
  if (!isAuthenticated && !isLoading) {
      // router.replace('/login'); // AuthProviderに任せるので、基本的にはここは不要
      return <LoadingSpinner message="リダイレクトしています..." />; // または null
  }


  return (
    <>
      <Head>
        <title>ダッシュボード - Forgejo TODOアプリ</title>
      </Head>
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1><i className="fas fa-tasks"></i> TODO アプリ</h1>
            {user && (
              <div className="user-info">
                <img
                  id="userAvatar"
                  className="user-avatar"
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.login)}&background=667eea&color=fff`}
                  alt="Avatar"
                />
                <span id="userName">{user.full_name || user.login}</span>
                {/* logout関数はAuthProviderから提供されるものを使用 */}
                <button id="logoutBtn" className="logout-btn" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="main-content">
          <TodoApp />
        </main>
      </div>
    </>
  );
}
