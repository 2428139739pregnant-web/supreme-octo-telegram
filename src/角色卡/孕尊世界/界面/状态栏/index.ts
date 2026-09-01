// 孕尊世界状态栏 — 纯 vanilla 实现
//
// 为什么不用 Vue:
//   webpack.config.ts 的 externals 把 `vue` 映射为裸全局 `Vue`, 打包产物里是 `const a=Vue;`.
//   该全局本应由酒馆助手 iframe 运行时提供, 但实测部分酒馆版本没有注入, 直接 `Vue is not defined`.
//   状态栏只是单向展示 + 整块重渲染, 不需要响应式, 所以退回 DOM 拼接最稳。
//
// 渲染时机:
//   waitGlobalInitialized('Mvu') 等 MVU 就绪, 再订阅 VARIABLE_UPDATE_ENDED 做增量重渲染。
//   全程 try/catch, 失败时在界面上渲染带诊断信息的错误面板 (而非留一个空白 iframe)。

import { waitUntil } from 'async-wait-until';
import './global.css';
import type { Schema } from '../../schema';

type Character = Schema['当前角色'][string];

// ============ 工具 ============

function esc(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/** 空值回退: null/undefined/'' 都视为缺失 */
function or(value: unknown, fallback: string | number): string {
  return esc(value === null || value === undefined || value === '' ? fallback : value);
}

function obj(value: unknown): Record<string, any> {
  return _.isPlainObject(value) ? (value as Record<string, any>) : {};
}

/** 腹围 → 进度条百分比, FILL_MAX 为视觉满格 */
const FILL_MAX = 110;
function bellyPercent(cm: unknown): number {
  return _.clamp(((Number(cm) || 0) / FILL_MAX) * 100, 0, 100);
}

function rows(source: Record<string, any>, keys: string[]): string {
  return keys.map(key => `<dt>${esc(key)}</dt><dd>${or(source[key], '—')}</dd>`).join('');
}

// ============ 面板 ============

function renderWorld(world: Record<string, any>): string {
  const w = obj(world);
  const prose = w.周边环境 ? `<div class="field-prose">${esc(w.周边环境)}</div>` : '';
  return `<section class="panel">
    <header class="panel-header"><span>🌐 世界</span><span class="field-dim">${or(w.当前时间, '—')}</span></header>
    <div class="panel-body">
      <dl>${rows(w, ['当前地点', '国家', '天气'])}</dl>
      ${prose}
    </div>
  </section>`;
}

function renderBasic(char: Character): string {
  const c = obj(char);
  const tri = obj(c.三围);
  const dress = Object.entries(obj(c.着装));
  const dressBlock = dress.length
    ? `<details class="collapsible">
        <summary>着装 (${dress.length} 项)</summary>
        <ul class="dress-list">${dress
          .map(([part, desc]) => `<li><span class="dress-part">${esc(part)}</span><span>${esc(desc)}</span></li>`)
          .join('')}</ul>
      </details>`
    : '';
  const action = c.当前行动 ? `<div class="field-prose">→ ${esc(c.当前行动)}</div>` : '';
  return `<section class="panel">
    <header class="panel-header"><span>👤 基础信息</span><span class="field-emphasis">${or(c.名字, '未设定')}</span></header>
    <div class="panel-body">
      <dl>
        <dt>身份</dt><dd class="field-emphasis">${or(c.身份, '—')}</dd>
        <dt>年龄</dt><dd>${or(c.年龄, '—')} 岁</dd>
        <dt>身高</dt><dd>${or(c.身高, '—')} cm</dd>
        <dt>体重</dt><dd>${or(c.体重, '—')} kg</dd>
        <dt>三围</dt><dd><span class="field-emphasis">${or(tri.Bust, '—')}</span> / <span class="field-emphasis">${or(tri.Waist, '—')}</span> / ${or(tri.Hips, '—')}</dd>
        ${rows(c, ['健康状况', '性经验'])}
      </dl>
      ${action}
      ${dressBlock}
    </div>
  </section>`;
}

function renderPregnancy(char: Character): string {
  const preg = obj(obj(char).妊娠);
  const fetus = obj(obj(char).胎儿);
  const weeks = Number(preg.周数) || 0;
  const detail =
    weeks > 0
      ? `<details class="collapsible" open>
          <summary>胎儿状态</summary>
          <dl>${rows(fetus, ['大小', '物种', '胎位', '动作', '反应', '心情', '入盆'])}</dl>
        </details>`
      : '';
  return `<section class="panel">
    <header class="panel-header"><span>🫄 妊娠</span><span class="field-emphasis">${or(preg.状态, '未怀孕')}</span></header>
    <div class="panel-body">
      <dl>
        <dt>周数</dt><dd>${or(preg.周数, 0)} 周</dd>
        <dt>胎儿数目</dt><dd>${or(preg.胎儿数目, 0)}</dd>
      </dl>
      ${detail}
    </div>
  </section>`;
}

function renderBelly(char: Character): string {
  const belly = obj(obj(char).肚子);
  const look = belly.外观描述 ? `<div class="field-prose">${esc(belly.外观描述)}</div>` : '';
  return `<section class="panel">
    <header class="panel-header"><span>🤰 肚子</span><span class="field-dim">腹围 ${or(belly.腹围, 0)} cm</span></header>
    <div class="panel-body">
      ${look}
      <dl>${rows(belly, ['类型', '大小描述', '挺翘度', '柔韧性', '光泽度'])}</dl>
      <div class="belly-bar-wrap">
        <div class="belly-bar-label"><span>小</span><span class="field-emphasis">腹围进度</span><span>大</span></div>
        <div class="belly-bar-track">
          <div class="belly-bar-fill" style="width:${bellyPercent(belly.腹围)}%"></div>
          <div class="belly-bar-marker" style="left:50%"></div>
          <div class="belly-bar-marker" style="left:80%"></div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderOrgans(char: Character): string {
  const organs = obj(obj(char).器官);
  const keys = ['子宫', '羊膜', '胃部', '膀胱', '肠子'];
  const empty = keys.every(k => !organs[k]);
  const body = empty ? '<p class="empty-hint">暂无器官状态记录</p>' : `<dl>${rows(organs, keys)}</dl>`;
  return `<section class="panel">
    <header class="panel-header"><span>🫀 器官</span></header>
    <div class="panel-body">${body}</div>
  </section>`;
}

function renderBodyParts(char: Character): string {
  const c = obj(char);
  const parts = obj(c.性器官);
  const thought = c.对肚子的想法
    ? `<details class="collapsible" open><summary>对肚子的想法</summary><div class="field-prose">${esc(c.对肚子的想法)}</div></details>`
    : '';
  return `<section class="panel">
    <header class="panel-header"><span>💋 身体</span></header>
    <div class="panel-body">
      <details class="collapsible">
        <summary>性器官状态</summary>
        <dl>${rows(parts, ['胸部状态', '臀部状态', '小穴状态', '后穴状态'])}</dl>
      </details>
      ${thought}
    </div>
  </section>`;
}

function renderCharacter(name: string, char: Character, focused: boolean): string {
  return `<div class="character-group${focused ? ' character-focus' : ''}">
    <header class="character-header">
      <span class="character-name">👩 ${esc(name)}</span>
      ${focused ? '<span class="focus-badge">关注中</span>' : '<span class="focus-dim">未关注</span>'}
    </header>
    ${renderBasic(char)}
    ${renderPregnancy(char)}
    ${renderBelly(char)}
    ${renderOrgans(char)}
    ${renderBodyParts(char)}
  </div>`;
}

// ============ 主渲染 ============

function render(statData: unknown): void {
  const data = obj(statData);
  const characters = obj(data.当前角色);
  const focus = String(data.关注角色 ?? '');
  const names = Object.keys(characters);

  // 关注角色排在最前
  const ordered = names.includes(focus) ? [focus, ...names.filter(n => n !== focus)] : names;

  const body = ordered.length
    ? ordered.map(name => renderCharacter(name, characters[name], name === focus)).join('')
    : '<div class="empty-hint"><em>暂未遇见任何孕妇角色</em></div>';

  $('#app').html(`<div class="status-container">
    <h2 class="status-title">孕尊世界 · 状态栏</h2>
    ${renderWorld(data.世界)}
    ${body}
  </div>`);
}

function renderError(message: string, detail = ''): void {
  $('#app').html(`<div class="status-container">
    <div class="error-panel">
      <h3>⚠️ 状态栏加载失败</h3>
      <p>${esc(message)}</p>
      ${detail ? `<p class="error-hint">${detail}</p>` : ''}
    </div>
  </div>`);
}

$(async () => {
  try {
    await waitGlobalInitialized('Mvu');
    await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'), { timeout: 10_000 });

    const read = () => _.get(getVariables({ type: 'message' }), 'stat_data', {});

    render(read());
    console.info('[孕尊世界状态栏] 首次渲染完成, 角色:', Object.keys(obj(obj(read()).当前角色)));

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
      try {
        render(read());
      } catch (error) {
        console.error('[孕尊世界状态栏] 增量重渲染失败', error);
      }
    });
  } catch (error) {
    console.error('[孕尊世界状态栏] 初始化失败', error);
    renderError(
      error instanceof Error ? error.message : String(error),
      `getVariables=${typeof getVariables}, Mvu=${typeof Mvu}, eventOn=${typeof eventOn}`,
    );
  }
});
