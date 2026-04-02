<template>
  <div class="ffc">
    <AppHeader />
    <div class="ffc-body">

      <!-- ===== 左侧图形库 ===== -->
      <aside class="ffc-sidebar">
        <div class="panel-hd">
          <span class="panel-hd-title">图形库</span>
          <div class="panel-hd-tabs">
            <button v-for="tab in sidebarTabs" :key="tab.key" class="hd-tab"
              :class="{ active: activeSidebarTab === tab.key }" @click="activeSidebarTab = tab.key">
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 节点列表 -->
        <div v-show="activeSidebarTab === 'shapes'" class="sidebar-body">
          <div class="shape-group">
            <div class="shape-group-label">基础形状</div>
            <div class="shape-grid">
              <div v-for="shape in allShapes" :key="shape.key" class="shape-card"
                draggable="true" @dragstart="onShapeDragStart($event, shape)" @click="addNode(shape)"
                :title="`拖拽或点击添加 ${shape.name}`">
                <div class="shape-svg-wrap">
                  <svg :viewBox="`0 0 ${shape.vw} ${shape.vh}`" width="40" :height="shape.vh / shape.vw * 40"
                    fill="none" stroke="#94a3b8" stroke-width="1.5">
                    <path v-if="shape.svgPath" :d="shape.svgPath" fill="none" />
                    <component v-else :is="shape.svgTag || 'rect'" v-bind="shape.svgAttrs" fill="none" />
                  </svg>
                </div>
                <span class="shape-card-name">{{ shape.name }}</span>
              </div>
            </div>
          </div>
          <div class="sidebar-tip">
            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            点击或拖入画布，节点边缘拖出连线
          </div>
        </div>

        <!-- 线型选项卡 -->
        <div v-show="activeSidebarTab === 'edges'" class="sidebar-body">
          <div class="shape-group">
            <div class="shape-group-label">新连线默认类型</div>
            <div class="edge-type-list">
              <div v-for="et in edgeTypeItems" :key="et.value" class="edge-type-card"
                :class="{ active: defaultEdgeType === et.value }" @click="onSetDefaultEdgeType(et.value)">
                <svg class="edge-type-svg" viewBox="0 0 80 26" fill="none">
                  <path :d="et.previewPath" stroke="currentColor" stroke-width="1.8" fill="none"/>
                  <polygon points="70,13 64,9 64,17" fill="currentColor"/>
                </svg>
                <span>{{ et.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- ===== 中间画布 ===== -->
      <div class="ffc-canvas-area">
        <div class="toolbar">
          <!-- 缩放 -->
          <div class="toolbar-group">
            <button @click="zoomOut" class="tbtn" title="缩小"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/></svg></button>
            <button @click="resetZoom" class="zoom-badge" title="点击重置缩放">{{ Math.round(zoom * 100) }}%</button>
            <button @click="zoomIn" class="tbtn" title="放大"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg></button>
            <button @click="fitView" class="tbtn" title="适应画布"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg></button>
          </div>
          <div class="tbtn-sep"></div>
          <!-- 历史 -->
          <div class="toolbar-group">
            <button @click="undo" class="tbtn" title="撤销 Ctrl+Z"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg></button>
            <button @click="redo" class="tbtn" title="重做 Ctrl+Y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg></button>
          </div>
          <div class="tbtn-sep"></div>
          <!-- 布局 -->
          <div class="toolbar-group">
            <button @click="autoLayout" class="tbtn" title="自动布局 (Dagre)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h10M4 19h7"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 15l-3 3 3 3"/></svg></button>
          </div>
          <div class="tbtn-sep"></div>
          <!-- 编辑 -->
          <div class="toolbar-group">
            <button @click="deleteSelected" :disabled="!selectedId && !multiSelected" class="tbtn tbtn-danger" title="删除 Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <button @click="clearAll" class="tbtn tbtn-danger" title="清空画布">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </button>
          </div>
          <div class="tbtn-sep"></div>
          <!-- 背景 -->
          <div class="toolbar-group">
            <button v-for="bg in bgModes" :key="bg.key" class="tbtn" :class="{ 'tbtn-active': activeBg === bg.key }"
              :title="bg.label" @click="switchBg(bg.key)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" v-html="bg.icon"></svg>
            </button>
          </div>
          <div class="flex-1"></div>
          <!-- 文件 -->
          <div class="toolbar-group">
            <button @click="importJSON" class="tbtn" title="导入 JSON"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></button>
            <button @click="exportJSON" class="tbtn" title="导出 JSON"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg></button>
            <button @click="exportImage" class="tbtn-export">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              导出图片
            </button>
          </div>
        </div>

        <!-- 画布容器 -->
        <div ref="containerRef" class="canvas-box" :class="`bg-${activeBg}`"
          @dragover.prevent @drop="onCanvasDrop"></div>

        <!-- 空状态提示 -->
        <transition name="fade">
          <div class="canvas-empty" v-if="!hasNodes">
            <div class="canvas-empty-inner">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <p>从左侧拖入或点击图形</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- ===== 右侧属性面板 ===== -->
      <aside class="ffc-props">

        <!-- 多选批量属性 -->
        <template v-if="multiSelected">
          <div class="panel-hd">
            <span class="panel-hd-title">批量属性</span>
            <span class="badge badge-multi">{{ selectedNodes.length }}节点</span>
          </div>
          <div class="props-body">
            <div class="ps">
              <div class="ps-title">填充 & 边框</div>
              <div class="pr"><label class="pl">填充色</label><color-row :value="batchFill" :list="fillColors" @change="onBatchFillChange"/></div>
              <div class="pr"><label class="pl">边框色</label><color-row :value="batchStroke" :list="fillColors" @change="onBatchStrokeChange"/></div>
              <div class="pr">
                <label class="pl">边框宽</label>
                <div class="pi-row"><input v-model.number="batchStrokeWidth" type="number" min="0" max="12" class="pi pi-sm" @change="applyBatch({ strokeWidth: batchStrokeWidth })"/><span class="pu">px</span></div>
              </div>
            </div>
            <div class="ps">
              <div class="action-group">
                <button @click="alignSelectedH" class="abtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M4 18h16"/></svg>水平对齐</button>
                <button @click="alignSelectedV" class="abtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v16M12 8v8M18 4v16"/></svg>垂直对齐</button>
                <button @click="deleteSelectedMulti" class="abtn abtn-danger"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>删除选中</button>
              </div>
            </div>
          </div>
        </template>

        <!-- 节点属性 -->
        <template v-else-if="selectedType === 'node'">
          <div class="panel-hd">
            <span class="panel-hd-title">节点属性</span>
            <span class="badge badge-node">节点</span>
          </div>
          <div class="props-body">

            <div class="ps">
              <div class="ps-title">内容</div>
              <div class="pr">
                <label class="pl">文本</label>
                <input v-model="nodeText" type="text" class="pi" placeholder="节点文字" @change="updateNodeText" />
              </div>
              <div class="pr">
                <label class="pl">字号</label>
                <div class="pi-row"><input v-model.number="nodeFontSize" type="number" min="8" max="72" class="pi pi-sm" @change="updateNodeStyle"/><span class="pu">px</span></div>
              </div>
            </div>

            <div class="ps">
              <div class="ps-title">填充 & 边框</div>
              <div class="pr"><label class="pl">填充色</label><color-row :value="nodeColor" :list="fillColors" @change="onNodeFillChange"/></div>
              <div class="pr"><label class="pl">文字色</label><color-row :value="nodeTextColor" :list="textColorList" @change="onNodeTextColorChange"/></div>
              <div class="pr"><label class="pl">边框色</label><color-row :value="nodeBorderColor" :list="fillColors" @change="onNodeBorderColorChange"/></div>
              <div class="pr">
                <label class="pl">边框宽</label>
                <div class="pi-row"><input v-model.number="nodeBorderWidth" type="number" min="0" max="12" class="pi pi-sm" @change="updateNodeStyle"/><span class="pu">px</span></div>
              </div>
              <div class="pr">
                <label class="pl">圆角</label>
                <div class="pi-row"><input v-model.number="nodeRadius" type="number" min="0" max="60" class="pi pi-sm" @change="updateNodeStyle"/><span class="pu">px</span></div>
              </div>
            </div>

            <div class="ps">
              <div class="ps-title">形状</div>
              <div class="shape-type-grid">
                <button v-for="s in nodeShapesPanel" :key="s.value" class="stbtn" :class="{ active: nodeShapeType === s.value }" @click="selectShapeType(s.value)">
                  <svg :viewBox="`0 0 ${s.vw} ${s.vh}`" width="22" :height="s.vh/s.vw*22" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path v-if="s.svgPath" :d="s.svgPath"/>
                    <component v-else :is="s.svgTag||'rect'" v-bind="s.svgAttrs"/>
                  </svg>
                  <span>{{ s.label }}</span>
                </button>
              </div>
            </div>

            <div class="ps">
              <div class="ps-title">布局</div>
              <div class="p2col">
                <div><label class="pl">X</label><input v-model.number="nodeX" type="number" class="pi" @change="updateNodePosition"/></div>
                <div><label class="pl">Y</label><input v-model.number="nodeY" type="number" class="pi" @change="updateNodePosition"/></div>
                <div><label class="pl">宽</label><input v-model.number="nodeWidth" type="number" min="40" max="600" class="pi" @change="updateNodeSize"/></div>
                <div><label class="pl">高</label><input v-model.number="nodeHeight" type="number" min="30" max="400" class="pi" @change="updateNodeSize"/></div>
              </div>
            </div>

            <div class="ps">
              <div class="action-group">
                <button @click="duplicateNode" class="abtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>复制节点</button>
                <button @click="alignCenter" class="abtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M4 18h16"/></svg>水平居中</button>
                <button @click="alignMiddle" class="abtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v16M12 8v8M18 4v16"/></svg>垂直居中</button>
                <button @click="deleteSelected" class="abtn abtn-danger"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>删除节点</button>
              </div>
            </div>
          </div>
        </template>

        <!-- 连接线属性 -->
        <template v-else-if="selectedType === 'edge'">
          <div class="panel-hd">
            <span class="panel-hd-title">连接线属性</span>
            <span class="badge badge-edge">连接线</span>
          </div>
          <div class="props-body">

            <div class="ps">
              <div class="ps-title">标签</div>
              <div class="pr">
                <label class="pl">文字</label>
                <input v-model="edgeText" type="text" class="pi" placeholder="连接线标签" @input="updateEdgeText"/>
              </div>
            </div>

            <div class="ps">
              <div class="ps-title">线条</div>
              <div class="pr"><label class="pl">颜色</label><color-row :value="edgeColor" :list="fillColors" @change="onEdgeColorChange"/></div>
              <div class="pr">
                <label class="pl">粗细</label>
                <div class="pi-row"><input v-model.number="edgeWidth" type="number" min="1" max="10" class="pi pi-sm" @change="updateEdgeStyle"/><span class="pu">px</span></div>
              </div>
              <div class="pr">
                <label class="pl">线型</label>
                <div class="seg-ctrl">
                  <button v-for="ls in lineStyles" :key="ls.value" class="seg-btn" :class="{ active: edgeLineStyle === ls.value }"
                    @click="edgeLineStyle = ls.value; updateEdgeStyle()" :title="ls.label">
                    <svg width="32" height="10" viewBox="0 0 32 10">
                      <line x1="2" y1="5" x2="30" y2="5" stroke="#6b7280" stroke-width="1.5" :stroke-dasharray="ls.dasharray"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="pr">
                <label class="pl">类型</label>
                <div class="seg-ctrl">
                  <button v-for="et in edgeTypeItems" :key="et.value" class="seg-btn seg-text"
                    :class="{ active: edgeType === et.value }" @click="edgeType = et.value; applyEdgeType()">
                    {{ et.short }}
                  </button>
                </div>
              </div>
            </div>

            <div class="ps">
              <div class="ps-title">箭头</div>
              <div class="pr">
                <label class="pl">方向</label>
                <div class="seg-ctrl">
                  <button v-for="d in arrowDirections" :key="d.value" class="seg-btn seg-text"
                    :class="{ active: edgeArrowDir === d.value }" @click="edgeArrowDir = d.value; updateEdgeArrow()">
                    {{ d.short }}
                  </button>
                </div>
              </div>
              <div class="pr">
                <label class="pl">大小</label>
                <div class="pi-row"><input v-model.number="edgeArrowSize" type="number" min="4" max="24" class="pi pi-sm" @change="updateEdgeArrow"/><span class="pu">px</span></div>
              </div>
            </div>

            <div class="ps">
              <div class="action-group">
                <button @click="deleteSelected" class="abtn abtn-danger"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>删除连接</button>
              </div>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <template v-else>
          <div class="panel-hd"><span class="panel-hd-title">属性面板</span></div>
          <div class="props-empty">
            <div class="props-empty-icon">
              <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
              </svg>
            </div>
            <p>选中节点或连接线</p>
            <p class="hint">即可编辑属性，框选可批量操作</p>
          </div>
        </template>
      </aside>
    </div>

    <input ref="fileInputRef" type="file" class="hidden-input" accept=".json" @change="onFileImport"/>
  </div>
</template>

<script setup>
import { ref, defineComponent, h, onMounted, onUnmounted } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/es/style/index.css'
import { SelectionSelect, Snapshot } from '@logicflow/extension'
import AppHeader from '../components/AppHeader.vue'

// 全局安装插件（只需执行一次）
LogicFlow.use(SelectionSelect)
LogicFlow.use(Snapshot)

// ─── 内联子组件 ─────────────────────────────────────

// transparent 无法传给 input[type=color]，统一转为 #ffffff 兜底
const toColorInput = (v) => {
  if (!v || v === 'transparent' || v === 'none') return '#ffffff'
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v.length === 7 ? v : '#ffffff'
  return '#ffffff'
}
const isTransparent = (v) => !v || v === 'transparent' || v === 'none'

const ColorRow = defineComponent({
  props: { value: String, list: Array },
  emits: ['change'],
  setup(props, { emit }) {
    const pickerRef = ref(null)
    return () => {
      const val = props.value
      const isTrans = isTransparent(val)
      const dotStyle = isTrans
        ? { background: 'linear-gradient(135deg,#fff 45%,#f1f5f9 45%)', outline: '1px solid #d1d5db' }
        : { background: val, outline: (val === '#ffffff' || val === '#f8fafc') ? '1px solid #d1d5db' : 'none' }
      const hexLabel = isTrans ? '透明' : val?.toUpperCase()

      return h('div', { class: 'color-row-wrap' }, [
        h('div', { class: 'cr-display', onClick: () => { if (!isTrans) pickerRef.value?.click() } }, [
          h('div', { class: 'cr-dot', style: dotStyle }),
          h('span', { class: 'cr-hex' }, hexLabel),
        ]),
        h('input', {
          ref: pickerRef,
          type: 'color',
          class: 'hidden-input',
          value: toColorInput(val),
          onInput: e => emit('change', e.target.value),
        }),
        h('div', { class: 'cr-swatches' },
          (props.list || []).map(c => {
            const cTrans = isTransparent(c)
            return h('button', {
              key: c,
              class: ['crs', { active: val === c || (isTrans && cTrans) }],
              style: cTrans
                ? { background: 'linear-gradient(135deg,#fff 45%,#f1f5f9 45%)', outline: '1px solid #d1d5db' }
                : { background: c, outline: (c === '#ffffff' || c === '#f8fafc') ? '1px solid #d1d5db' : 'none' },
              title: cTrans ? '无填充' : c,
              onClick: () => emit('change', c),
            })
          })
        ),
      ])
    }
  }
})

// ─── SVG 形状定义 ────────────────────────────────────

// 所有图形，合并为一组
const allShapes = [
  // 基础几何（LF 内置类型）
  { key:'rect',          type:'rect',         name:'矩形',     width:120, height:60,  vw:60, vh:36, svgTag:'rect',    svgAttrs:{ x:1, y:1, width:58, height:34, rx:3 } },
  { key:'square',        type:'rect',         name:'正方形',   width:80,  height:80,  vw:40, vh:40, svgTag:'rect',    svgAttrs:{ x:1, y:1, width:38, height:38, rx:2 } },
  { key:'circle',        type:'circle',       name:'圆形',     width:80,  height:80,  vw:40, vh:40, svgTag:'circle',  svgAttrs:{ cx:20, cy:20, r:18 } },
  { key:'ellipse',       type:'ellipse',      name:'椭圆',     width:140, height:70,  vw:60, vh:36, svgTag:'ellipse', svgAttrs:{ cx:30, cy:18, rx:28, ry:16 } },
  { key:'diamond',       type:'diamond',      name:'菱形',     width:100, height:100, vw:50, vh:50, svgPath:'M25 2 L48 25 L25 48 L2 25 Z' },
  // 自定义形状
  { key:'triangle',      type:'triangle',     name:'三角形',   width:100, height:90,  vw:50, vh:46, svgPath:'M25 2 L48 44 L2 44 Z' },
  { key:'roundRect',     type:'roundRect',    name:'圆角矩形', width:120, height:50,  vw:60, vh:36, svgTag:'rect',    svgAttrs:{ x:1, y:1, width:58, height:34, rx:17 } },
  { key:'hexagon',       type:'hexagon',      name:'六边形',   width:110, height:80,  vw:60, vh:40, svgPath:'M20 2 L40 2 L58 20 L40 38 L20 38 L2 20 Z' },
  { key:'parallelogram', type:'parallelogram',name:'平行四边形',width:130, height:60,  vw:60, vh:36, svgPath:'M12 1 L59 1 L48 35 L1 35 Z' },
  { key:'trapezoid',     type:'trapezoid',    name:'梯形',     width:120, height:60,  vw:60, vh:36, svgPath:'M10 1 L50 1 L59 35 L1 35 Z' },
  { key:'pentagon',      type:'pentagon',     name:'五边形',   width:100, height:100, vw:50, vh:48, svgPath:'M25 2 L48 18 L39 46 L11 46 L2 18 Z' },
  { key:'callout',       type:'callout',      name:'气泡',     width:130, height:70,  vw:60, vh:46, svgPath:'M2 2 L58 2 L58 36 L24 36 L18 44 L14 36 L2 36 Z' },
  { key:'cylinder',      type:'cylinder',     name:'圆柱',     width:80,  height:100, vw:40, vh:50, svgPath:'M2 10 Q20 2 38 10 L38 40 Q20 48 2 40 Z M2 10 Q20 18 38 10' },
  { key:'cross',         type:'cross',        name:'十字',     width:80,  height:80,  vw:50, vh:50, svgPath:'M20 2 L30 2 L30 20 L48 20 L48 30 L30 30 L30 48 L20 48 L20 30 L2 30 L2 20 L20 20 Z' },
  { key:'star',          type:'star',         name:'星形',     width:90,  height:90,  vw:50, vh:48, svgPath:'M25 2 L30 18 L48 18 L34 28 L39 46 L25 36 L11 46 L16 28 L2 18 L20 18 Z' },
  { key:'person',        type:'person',       name:'人形',     width:70,  height:110, vw:40, vh:60, svgPath:'M20 8 A8 8 0 1 0 20.01 8 Z M8 28 Q10 18 20 18 Q30 18 32 28 L32 44 L26 44 L26 58 L14 58 L14 44 L8 44 Z' },
]

// 属性面板形状切换
const nodeShapesPanel = [
  { value:'rect',    label:'矩形', vw:40, vh:24, svgTag:'rect',    svgAttrs:{x:1,y:1,width:38,height:22,rx:2} },
  { value:'circle',  label:'圆形', vw:28, vh:28, svgTag:'circle',  svgAttrs:{cx:14,cy:14,r:12} },
  { value:'diamond', label:'菱形', vw:32, vh:32, svgPath:'M16 2 L30 16 L16 30 L2 16 Z' },
  { value:'ellipse', label:'椭圆', vw:40, vh:24, svgTag:'ellipse', svgAttrs:{cx:20,cy:12,rx:18,ry:10} },
]

// ─── 常量 ──────────────────────────────────────────

const sidebarTabs = [
  { key:'shapes', label:'图形' },
  { key:'edges',  label:'线型' },
]

const fillColors = [
  'transparent',
  '#3b82f6','#6366f1','#8b5cf6','#ec4899',
  '#ef4444','#f97316','#f59e0b','#eab308',
  '#84cc16','#22c55e','#10b981','#14b8a6',
  '#06b6d4','#0ea5e9','#64748b','#18181b',
  '#ffffff','#f8fafc','#e2e8f0',
]

const textColorList = [
  '#ffffff','#f8fafc','#e2e8f0','#94a3b8',
  '#64748b','#374151','#111827','#000000',
  '#3b82f6','#ef4444','#f59e0b','#10b981',
]

const edgeTypeItems = [
  { value:'polyline', label:'折线', short:'折', previewPath:'M8 19 L30 19 L30 7 L62 7' },
  { value:'line',     label:'直线', short:'直', previewPath:'M8 13 L62 13' },
  { value:'bezier',   label:'曲线', short:'曲', previewPath:'M8 20 C20 20 50 6 62 6' },
]

const arrowDirections = [
  { value:'target', short:'→', label:'单向 →' },
  { value:'source', short:'←', label:'反向 ←' },
  { value:'both',   short:'↔', label:'双向 ↔' },
  { value:'none',   short:'—', label:'无箭头' },
]

const lineStyles = [
  { value:'solid',    label:'实线',   dasharray:'none' },
  { value:'dashed',   label:'虚线',   dasharray:'6 3'  },
  { value:'dotted',   label:'点线',   dasharray:'2 3'  },
  { value:'dash-dot', label:'点划线', dasharray:'8 3 2 3' },
]

const bgModes = [
  { key:'dot',   label:'点阵', icon:'<circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="19" cy="19" r="1.5" fill="currentColor"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/><circle cx="19" cy="5" r="1.5" fill="currentColor"/>' },
  { key:'grid',  label:'网格', icon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 8h16M4 16h16M8 4v16M16 4v16"/>' },
  { key:'plain', label:'纯色', icon:'<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.8"/>' },
]

// ─── 状态 ──────────────────────────────────────────

const containerRef = ref(null)
const fileInputRef = ref(null)
const lf           = ref(null)

const zoom             = ref(1)
const hasNodes         = ref(false)
const activeSidebarTab = ref('shapes')
const activeBg         = ref('dot')
const defaultEdgeType  = ref('polyline')

let dragShape = null

const selectedId   = ref(null)
const selectedType = ref(null)

// 多选状态
const multiSelected  = ref(false)
const selectedNodes  = ref([])  // 多选时节点 id 数组

// 批量属性
const batchFill        = ref('transparent')
const batchStroke      = ref('#94a3b8')
const batchStrokeWidth = ref(1.5)

// 节点属性
const nodeText        = ref('')
const nodeColor       = ref('transparent')
const nodeTextColor   = ref('#374151')
const nodeBorderColor = ref('#94a3b8')
const nodeBorderWidth = ref(1.5)
const nodeFontSize    = ref(14)
const nodeRadius      = ref(4)
const nodeShapeType   = ref('rect')
const nodeX           = ref(0)
const nodeY           = ref(0)
const nodeWidth       = ref(120)
const nodeHeight      = ref(60)

// 连接线属性
const edgeText      = ref('')
const edgeColor     = ref('#94a3b8')
const edgeWidth     = ref(2)
const edgeLineStyle = ref('solid')
const edgeType      = ref('polyline')
const edgeArrowDir  = ref('target')
const edgeArrowSize = ref(8)

// ─── 工具 ──────────────────────────────────────────

const getTextFromData = (d) => {
  if (!d?.text) return ''
  return typeof d.text === 'string' ? d.text : (d.text.value || '')
}

const dashArr = (s) => ({ solid:'none', dashed:'6 3', dotted:'2 3', 'dash-dot':'8 3 2 3' }[s] || 'none')

// ─── 初始化 ─────────────────────────────────────────

// 自定义节点：用归一化坐标函数生成任意 path 形状
// pts 是 0~1 范围的相对坐标数组 [[rx,ry], ...]，转成绝对 SVG path
const makePtsPath = (pts, x, y, w, h) => {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x - w/2 + p[0]*w},${y - h/2 + p[1]*h}`).join(' ') + ' Z'
}

// 每种自定义形状的归一化顶点（相对坐标 0~1）
const CUSTOM_SHAPES = {
  triangle:      { pts: [[0.5,0],[1,1],[0,1]] },
  roundRect:     { rounded: true },   // 用 rect 渲染，rx 设大
  hexagon:       { pts: [[0.25,0],[0.75,0],[1,0.5],[0.75,1],[0.25,1],[0,0.5]] },
  parallelogram: { pts: [[0.2,0],[1,0],[0.8,1],[0,1]] },
  trapezoid:     { pts: [[0.15,0],[0.85,0],[1,1],[0,1]] },
  pentagon:      { pts: [[0.5,0],[1,0.38],[0.79,1],[0.21,1],[0,0.38]] },
  callout:       { custom: 'callout' },
  cylinder:      { custom: 'cylinder' },
  cross:         { pts: [[0.33,0],[0.67,0],[0.67,0.33],[1,0.33],[1,0.67],[0.67,0.67],[0.67,1],[0.33,1],[0.33,0.67],[0,0.67],[0,0.33],[0.33,0.33]] },
  star:          { custom: 'star' },
  person:        { custom: 'person' },
}

const registerCustomNodes = (lfInstance) => {
  Object.entries(CUSTOM_SHAPES).forEach(([type, def]) => {
    lfInstance.register(type, ({ h: hh, RectNode, RectNodeModel }) => {
      class CustomView extends RectNode {
        getShape() {
          const { model } = this.props
          const { x, y, width: w, height: ht } = model
          const style = model.getNodeStyle()
          const { fill = 'transparent', stroke = '#94a3b8', strokeWidth = 1.5 } = style

          // 气泡：矩形+三角指示
          if (def.custom === 'callout') {
            const tailH = Math.min(ht * 0.25, 16)
            const bh = ht - tailH
            return hh('g', {}, [
              hh('path', {
                d: `M${x-w/2},${y-ht/2} L${x+w/2},${y-ht/2} L${x+w/2},${y-ht/2+bh} L${x-w/2+w*0.4},${y-ht/2+bh} L${x-w/2+w*0.3},${y+ht/2} L${x-w/2+w*0.22},${y-ht/2+bh} L${x-w/2},${y-ht/2+bh} Z`,
                fill, stroke, strokeWidth,
              }),
            ])
          }
          // 圆柱
          if (def.custom === 'cylinder') {
            const rx = w / 2, ry = Math.min(ht * 0.15, 14)
            return hh('g', {}, [
              hh('path', {
                d: `M${x-rx},${y-ht/2+ry} L${x-rx},${y+ht/2-ry} A${rx},${ry} 0 0,0 ${x+rx},${y+ht/2-ry} L${x+rx},${y-ht/2+ry} A${rx},${ry} 0 0,1 ${x-rx},${y-ht/2+ry} Z`,
                fill, stroke, strokeWidth,
              }),
              hh('ellipse', {
                cx: x, cy: y - ht/2 + ry,
                rx, ry,
                fill, stroke, strokeWidth,
              }),
            ])
          }
          // 星形（5角）
          if (def.custom === 'star') {
            const outerR = Math.min(w, ht) / 2
            const innerR = outerR * 0.42
            const pts5 = []
            for (let i = 0; i < 10; i++) {
              const angle = (Math.PI / 5) * i - Math.PI / 2
              const r = i % 2 === 0 ? outerR : innerR
              pts5.push([x + r * Math.cos(angle), y + r * Math.sin(angle)])
            }
            const d5 = pts5.map((p, i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ') + ' Z'
            return hh('path', { d: d5, fill, stroke, strokeWidth })
          }
          // 人形
          if (def.custom === 'person') {
            const headR = w * 0.22
            const hx = x, hy = y - ht/2 + headR + 2
            const shoulderY = hy + headR + 2
            const bodyH = ht * 0.35
            const legY = shoulderY + bodyH
            return hh('g', {}, [
              hh('circle', { cx: hx, cy: hy, r: headR, fill, stroke, strokeWidth }),
              hh('path', {
                d: `M${x-w*0.38},${legY+ht*0.3} L${x-w*0.18},${legY} L${hx},${shoulderY+bodyH*0.3} L${x+w*0.18},${legY} L${x+w*0.38},${legY+ht*0.3}`,
                fill: 'none', stroke, strokeWidth,
              }),
              hh('path', {
                d: `M${x-w*0.42},${shoulderY+bodyH*0.4} Q${hx},${shoulderY} ${x+w*0.42},${shoulderY+bodyH*0.4}`,
                fill: 'none', stroke, strokeWidth,
              }),
              hh('path', {
                d: `M${x-w*0.18},${shoulderY} L${x-w*0.18},${legY} L${x+w*0.18},${legY} L${x+w*0.18},${shoulderY}`,
                fill, stroke, strokeWidth,
              }),
            ])
          }
          // 圆角矩形
          if (def.rounded) {
            const rx2 = Math.min(w, ht) * 0.45
            return hh('rect', {
              x: x - w/2, y: y - ht/2, width: w, height: ht, rx: rx2,
              fill, stroke, strokeWidth,
            })
          }
          // 多边形 pts
          const d = makePtsPath(def.pts, x, y, w, ht)
          return hh('path', { d, fill, stroke, strokeWidth })
        }
      }

      class CustomModel extends RectNodeModel {
        initNodeData(data) {
          super.initNodeData(data)
          this.type = type  // initNodeData 之后再强制设回正确 type
        }
        getNodeStyle() {
          const base = super.getNodeStyle()
          return { ...base, ...(this.properties?.style || {}) }
        }
      }

      return { view: CustomView, model: CustomModel }
    })
  })
}

const initLogicFlow = () => {
  if (!containerRef.value) return

  lf.value = new LogicFlow({
    container: containerRef.value,
    grid: { size: 10, type: 'dot', visible: true, config: { color: '#c8d3e0', thickness: 2 } },
    snapline: true,
    snaplineEpsilon: 8,
    keyboard: { enabled: true },
    nodeTextEdit: true,
    edgeTextEdit: true,
    multipleSelect: true,
    allowResize: true,
    adjustEdge: true,
    history: true,
    edgeType: 'polyline',
    style: {
      rect:     { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5, radius: 4 },
      circle:   { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5 },
      diamond:  { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5 },
      ellipse:  { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5 },
      text:     { color: '#374151', fontSize: 14 },
      baseEdge: { stroke: '#94a3b8', strokeWidth: 2 },
      edgeText: {
        color: '#64748b', fontSize: 12,
        background: { fill: '#fff', stroke: '#e2e8f0', height: 20, radius: 4 },
      },
      snapline: { stroke: '#3b82f6', strokeWidth: 1 },
    },
  })

  // 注册自定义节点（必须在 render 之前）
  registerCustomNodes(lf.value)

  lf.value.render()
  bindEvents()

  // 开启框选（SelectionSelect 插件）
  lf.value.extension?.selectionSelect?.openSelectionSelect()
}

const bindEvents = () => {
  lf.value.on('node:click', ({ data }) => {
    if (destroyed) return
    multiSelected.value = false
    selectedNodes.value = []
    selectNode(data)
  })
  lf.value.on('edge:click', ({ data }) => {
    if (destroyed) return
    multiSelected.value = false
    selectedNodes.value = []
    selectEdge(data)
  })
  lf.value.on('blank:click', () => {
    if (destroyed) return
    clearSelection()
    multiSelected.value = false
    selectedNodes.value = []
  })
  lf.value.on('node:drag', ({ data }) => {
    if (destroyed) return
    if (selectedId.value === data.id) { nodeX.value = Math.round(data.x); nodeY.value = Math.round(data.y) }
  })
  lf.value.on('graph:transform', () => {
    if (destroyed) return
    zoom.value = lf.value.graphModel.transformModel.SCALE_X
  })
  lf.value.on('node:add',       syncHasNodes)
  lf.value.on('node:delete',    syncHasNodes)
  lf.value.on('graph:rendered', syncHasNodes)

  // 圈选多节点：SelectionSelect 插件触发
  lf.value.on('selection:selected', () => {
    if (destroyed) return
    const selectedNodeModels = lf.value.graphModel.nodes.filter(n => n.isSelected)
    if (selectedNodeModels.length > 1) {
      multiSelected.value = true
      selectedNodes.value = selectedNodeModels.map(n => n.id)
      selectedId.value = null
      selectedType.value = null
      const s = selectedNodeModels[0].getProperties()?.style || {}
      batchFill.value        = s.fill        || 'transparent'
      batchStroke.value      = s.stroke      || '#94a3b8'
      batchStrokeWidth.value = s.strokeWidth ?? 1.5
    } else if (selectedNodeModels.length === 1) {
      multiSelected.value = false
      selectedNodes.value = []
      selectNode(selectedNodeModels[0].getData())
    } else {
      multiSelected.value = false
      selectedNodes.value = []
    }
  })
}

const syncHasNodes = () => {
  if (destroyed) return
  const d = lf.value?.getGraphData()
  hasNodes.value = (d?.nodes?.length || 0) > 0
}

// ─── 拖拽 ──────────────────────────────────────────

const onShapeDragStart = (e, shape) => {
  dragShape = shape
  e.dataTransfer.effectAllowed = 'copy'
  e.dataTransfer.setData('text/plain', shape.key)
}

const onCanvasDrop = (e) => {
  e.preventDefault()
  if (!dragShape || !lf.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const { transformModel } = lf.value.graphModel
  const x = (e.clientX - rect.left - transformModel.TRANSLATE_X) / transformModel.SCALE_X
  const y = (e.clientY - rect.top  - transformModel.TRANSLATE_Y) / transformModel.SCALE_Y
  doAddNode(dragShape, x, y)
  dragShape = null
}

// ─── 选中 ──────────────────────────────────────────

const selectNode = (data) => {
  selectedId.value   = data.id
  selectedType.value = 'node'
  nodeText.value      = getTextFromData(data)
  nodeShapeType.value = data.type
  nodeX.value         = Math.round(data.x)
  nodeY.value         = Math.round(data.y)
  nodeWidth.value     = data.width  || 120
  nodeHeight.value    = data.height || 60
  const s = data.properties?.style || {}
  nodeColor.value       = s.fill        || 'transparent'
  nodeBorderColor.value = s.stroke      || '#94a3b8'
  nodeBorderWidth.value = s.strokeWidth ?? 1.5
  nodeRadius.value      = s.radius      ?? 4
  nodeTextColor.value   = data.properties?.textStyle?.color    || '#374151'
  nodeFontSize.value    = data.properties?.textStyle?.fontSize || 14
}

const selectEdge = (data) => {
  selectedId.value   = data.id
  selectedType.value = 'edge'
  edgeText.value     = getTextFromData(data)
  const s = data.properties?.edgeStyle || {}
  edgeColor.value     = s.stroke      || '#94a3b8'
  edgeWidth.value     = s.strokeWidth ?? 2
  edgeLineStyle.value = s.lineStyle   || 'solid'
  edgeType.value      = data.type     || 'polyline'
  edgeArrowDir.value  = data.properties?.arrowDir  || 'target'
  edgeArrowSize.value = data.properties?.arrowSize || 8
}

const clearSelection = () => { selectedId.value = null; selectedType.value = null }

// ─── 节点操作 ──────────────────────────────────────

const addNode = (shape) => {
  if (!lf.value) return
  const nodes = lf.value.getGraphData().nodes || []
  const c = containerRef.value
  const cx = (c?.clientWidth  || 800) / 2 + (nodes.length % 5) * 30 - 60
  const cy = (c?.clientHeight || 600) / 2 + Math.floor(nodes.length / 5) * 36 - 40
  doAddNode(shape, cx, cy)
}

const doAddNode = (shape, x, y) => {
  const nodeConfig = {
    type: shape.type,
    x, y,
    text: shape.name,
    properties: {
      style: { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5, radius: shape.type === 'rect' ? 4 : 0 },
    },
  }
  const node = lf.value.addNode(nodeConfig)
  // addNode 后立即设置 model 尺寸（rect 使用默认尺寸，无需额外设置）
  if (shape.key !== 'rect' && shape.width && shape.height) {
    const nodeId = node?.id || lf.value.getGraphData().nodes.at(-1)?.id
    if (nodeId) {
      const m = lf.value.getNodeModelById(nodeId)
      if (m) {
        // ellipse 内置类型通过 rx/ry 控制尺寸；其他类型（含自定义）直接赋 width/height
        if (shape.type === 'ellipse') {
          m.rx = shape.width / 2
          m.ry = shape.height / 2
        } else if (shape.type === 'circle') {
          m.r = Math.min(shape.width, shape.height) / 2
        } else {
          m.width = shape.width
          m.height = shape.height
        }
      }
    }
  }
  hasNodes.value = true
}

// 节点样式：写入 properties.style（优先级最高，覆盖 theme）
const applyNodeProps = (overrides) => {
  if (!lf.value || !selectedId.value) return
  const m = lf.value.getNodeModelById(selectedId.value)
  if (!m) return
  const curr = m.getProperties()
  m.setProperties({ ...curr, style: { ...(curr.style || {}), ...overrides } })
}

const onNodeFillChange        = (c) => { nodeColor.value = c; applyNodeProps({ fill: c }) }
const onNodeBorderColorChange = (c) => { nodeBorderColor.value = c; applyNodeProps({ stroke: c }) }
const onNodeTextColorChange   = (c) => {
  nodeTextColor.value = c
  const m = lf.value?.getNodeModelById(selectedId.value)
  if (!m) return
  const curr = m.getProperties()
  m.setProperties({ ...curr, textStyle: { ...(curr.textStyle || {}), color: c } })
}

const updateNodeStyle = () => {
  applyNodeProps({ strokeWidth: nodeBorderWidth.value, radius: nodeRadius.value })
  const m = lf.value?.getNodeModelById(selectedId.value)
  if (!m) return
  const curr = m.getProperties()
  m.setProperties({ ...curr, textStyle: { ...(curr.textStyle || {}), fontSize: nodeFontSize.value } })
}

const updateNodeText     = () => lf.value?.updateText(selectedId.value, nodeText.value)
const selectShapeType    = (t) => { nodeShapeType.value = t; if (lf.value && selectedId.value) lf.value.changeNodeType(selectedId.value, t) }
const updateNodePosition = () => { lf.value?.getNodeModelById(selectedId.value)?.moveTo(nodeX.value, nodeY.value) }
const updateNodeSize = () => {
  const m = lf.value?.getNodeModelById(selectedId.value)
  if (!m) return
  if (m.type === 'ellipse') {
    m.rx = nodeWidth.value / 2
    m.ry = nodeHeight.value / 2
  } else if (m.type === 'circle') {
    m.r = Math.min(nodeWidth.value, nodeHeight.value) / 2
  } else {
    m.width = nodeWidth.value
    m.height = nodeHeight.value
  }
}

const duplicateNode = () => {
  if (!lf.value || !selectedId.value) return
  const m = lf.value.getNodeModelById(selectedId.value)
  if (!m) return
  const d = m.getData()
  lf.value.addNode({ type:d.type, x:d.x+30, y:d.y+30, text:getTextFromData(d), properties:{...d.properties} })
}

const alignCenter = () => {
  const m = lf.value?.getNodeModelById(selectedId.value)
  if (!m || !containerRef.value) return
  m.moveTo(containerRef.value.clientWidth / 2, m.y)
  nodeX.value = Math.round(m.x)
}
const alignMiddle = () => {
  const m = lf.value?.getNodeModelById(selectedId.value)
  if (!m || !containerRef.value) return
  m.moveTo(m.x, containerRef.value.clientHeight / 2)
  nodeY.value = Math.round(m.y)
}

// ─── 批量操作 ──────────────────────────────────────

const applyBatch = (styleOverrides) => {
  if (!lf.value) return
  selectedNodes.value.forEach(id => {
    const m = lf.value.getNodeModelById(id)
    if (!m) return
    const curr = m.getProperties()
    m.setProperties({ ...curr, style: { ...(curr.style || {}), ...styleOverrides } })
  })
}

const onBatchFillChange   = (c) => { batchFill.value   = c; applyBatch({ fill: c }) }
const onBatchStrokeChange = (c) => { batchStroke.value = c; applyBatch({ stroke: c }) }

const alignSelectedH = () => {
  if (!lf.value || !selectedNodes.value.length) return
  const models = selectedNodes.value.map(id => lf.value.getNodeModelById(id)).filter(Boolean)
  if (!models.length) return
  const avgY = models.reduce((s, m) => s + m.y, 0) / models.length
  models.forEach(m => m.moveTo(m.x, avgY))
}

const alignSelectedV = () => {
  if (!lf.value || !selectedNodes.value.length) return
  const models = selectedNodes.value.map(id => lf.value.getNodeModelById(id)).filter(Boolean)
  if (!models.length) return
  const avgX = models.reduce((s, m) => s + m.x, 0) / models.length
  models.forEach(m => m.moveTo(avgX, m.y))
}

const deleteSelectedMulti = () => {
  if (!lf.value) return
  selectedNodes.value.forEach(id => { try { lf.value.deleteNode(id) } catch {} })
  multiSelected.value = false
  selectedNodes.value = []
  syncHasNodes()
}

// ─── 连接线操作 ────────────────────────────────────

const updateEdgeText = () => {
  if (!lf.value || !selectedId.value) return
  const m = lf.value.getEdgeModelById(selectedId.value)
  m?.updateText(edgeText.value)
}

const onEdgeColorChange = (c) => { edgeColor.value = c; updateEdgeStyle() }

const updateEdgeStyle = () => {
  if (!lf.value || !selectedId.value) return
  const m = lf.value.getEdgeModelById(selectedId.value)
  if (!m) return
  const s = { stroke: edgeColor.value, strokeWidth: edgeWidth.value, strokeDasharray: dashArr(edgeLineStyle.value) }
  m.setStyles(s)
  m.setProperty('edgeStyle', { ...s, lineStyle: edgeLineStyle.value })
}

const applyEdgeType = () => {
  if (!lf.value || !selectedId.value) return
  lf.value.changeEdgeType(selectedId.value, edgeType.value)
  setTimeout(() => updateEdgeStyle(), 50)
}

// 箭头方向：通过 setStyles 写入 startArrowType/endArrowType
// getArrowStyle = {...edgeStyle(baseEdge+this.style), ...theme.arrow}
// this.style 的优先级高于 theme.arrow，所以写入 style 可覆盖 arrowType
const updateEdgeArrow = () => {
  if (!lf.value || !selectedId.value) return
  const m = lf.value.getEdgeModelById(selectedId.value)
  if (!m) return
  const dir  = edgeArrowDir.value
  const size = edgeArrowSize.value

  const endType   = (dir === 'target' || dir === 'both')  ? 'solid' : 'none'
  const startType = (dir === 'source' || dir === 'both')  ? 'solid' : 'none'

  // 将 endArrowType/startArrowType 写入 this.style，它会被合并到 getArrowStyle()
  const existingStyle = { ...m.style }
  m.setStyles({
    ...existingStyle,
    endArrowType:   endType,
    startArrowType: startType,
    offset:         size,
    verticalLength: Math.round(size * 0.6),
  })
  m.setProperty('arrowDir',  dir)
  m.setProperty('arrowSize', size)
}

// ─── 工具栏 ────────────────────────────────────────

const onSetDefaultEdgeType = (t) => { defaultEdgeType.value = t; lf.value?.setDefaultEdgeType(t) }

// 缩放：使用 lf.zoom(true/false)，读取 transformModel.SCALE_X
const zoomIn  = () => {
  if (!lf.value) return
  lf.value.zoom(true)
  zoom.value = lf.value.graphModel.transformModel.SCALE_X
}
const zoomOut = () => {
  if (!lf.value) return
  lf.value.zoom(false)
  zoom.value = lf.value.graphModel.transformModel.SCALE_X
}
const fitView = () => {
  lf.value?.fitView(20)
  setTimeout(() => { zoom.value = lf.value?.graphModel.transformModel.SCALE_X ?? 1 }, 50)
}
const resetZoom = () => {
  if (!lf.value) return
  lf.value.resetZoom()
  zoom.value = 1
}

const undo = () => lf.value?.undo()
const redo = () => lf.value?.redo()

// 清空画布：用 render({}) 代替 clearGraph()，更稳定
const clearAll = () => {
  if (!lf.value) return
  try {
    lf.value.render({ nodes: [], edges: [] })
  } catch (e) {
    console.warn('clearAll error:', e)
  }
  clearSelection()
  multiSelected.value = false
  selectedNodes.value = []
  hasNodes.value = false
}

const deleteSelected = () => {
  if (!lf.value) return
  if (multiSelected.value) { deleteSelectedMulti(); return }
  if (!selectedId.value) return
  try {
    if (selectedType.value === 'edge') lf.value.deleteEdge(selectedId.value)
    else lf.value.deleteNode(selectedId.value)
  } catch (e) {}
  clearSelection()
  syncHasNodes()
}

// 背景切换：纯 CSS class 控制，LF 内置 grid SVG 已通过全局 CSS 隐藏
const switchBg = (key) => {
  activeBg.value = key
}

// ─── 自动布局 (Dagre) ─────────────────────────────

const autoLayout = async () => {
  if (!lf.value) return
  const data = lf.value.getGraphData()
  if (!data.nodes?.length) return

  // 动态引入 dagre-d3-es
  // dagre-d3-es/src/index.js 导出 { graphlib, render, intersect }
  // dagre-d3-es/src/dagre/index.js 导出 { layout }
  try {
    const { graphlib } = await import('dagre-d3-es/src/index.js')
    const { layout }   = await import('dagre-d3-es/src/dagre/index.js')
    const g = new graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80, marginx: 40, marginy: 40 })

    data.nodes.forEach(n => {
      const m = lf.value.getNodeModelById(n.id)
      g.setNode(n.id, { width: m?.width || 120, height: m?.height || 60 })
    })
    data.edges?.forEach(e => {
      if (e.sourceNodeId && e.targetNodeId) {
        try { g.setEdge(e.sourceNodeId, e.targetNodeId) } catch {}
      }
    })

    layout(g)

    g.nodes().forEach(id => {
      const pos = g.node(id)
      if (pos) lf.value.getNodeModelById(id)?.moveTo(pos.x, pos.y)
    })
    setTimeout(() => fitView(), 80)
    return
  } catch (e) {
    console.warn('Dagre layout failed, fallback to topo:', e)
  }

  // Fallback: 拓扑层次布局
  const container = containerRef.value
  const W = container?.clientWidth  || 800
  const H = container?.clientHeight || 600
  const padX = 80, padY = 80

  const map = {}
  data.nodes.forEach(n => { map[n.id] = { id: n.id, outs: [], ins: 0 } })
  data.edges?.forEach(e => {
    if (map[e.sourceNodeId] && map[e.targetNodeId]) {
      map[e.sourceNodeId].outs.push(e.targetNodeId)
      map[e.targetNodeId].ins++
    }
  })

  const levels = []
  let queue = Object.values(map).filter(n => n.ins === 0).map(n => n.id)
  const placed = new Set()

  while (queue.length) {
    levels.push([...queue])
    queue.forEach(id => placed.add(id))
    const next = []
    queue.forEach(id => {
      map[id]?.outs.forEach(cid => {
        if (!placed.has(cid)) {
          map[cid].ins--
          if (map[cid].ins === 0) next.push(cid)
        }
      })
    })
    queue = next
  }

  const unplaced = data.nodes.filter(n => !placed.has(n.id)).map(n => n.id)
  if (unplaced.length) levels.push(unplaced)

  if (levels.length > 0) {
    const hGap = Math.min(200, (W - padX * 2) / Math.max(1, Math.max(...levels.map(l => l.length))))
    const vGap = Math.min(150, (H - padY * 2) / Math.max(1, levels.length))
    levels.forEach((ids, li) => {
      const rowW = (ids.length - 1) * hGap
      const startX = W / 2 - rowW / 2
      ids.forEach((id, i) => {
        lf.value.getNodeModelById(id)?.moveTo(startX + i * hGap, padY + li * vGap)
      })
    })
  }
  setTimeout(() => fitView(), 80)
}

// ─── 导入导出 ──────────────────────────────────────

const exportImage = async () => {
  if (!lf.value) return
  try {
    await lf.value.getSnapshot(`flowchart-${Date.now()}`, { fileType: 'png', backgroundColor: '#ffffff', padding: 40 })
  } catch (e) { console.error('Export failed:', e) }
}

const exportJSON = () => {
  if (!lf.value) return
  const blob = new Blob([JSON.stringify(lf.value.getGraphData(), null, 2)], { type:'application/json' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `flowchart-${Date.now()}.json` })
  a.click(); URL.revokeObjectURL(a.href)
}

const importJSON = () => fileInputRef.value?.click()

const onFileImport = (e) => {
  const file = e.target.files?.[0]
  if (!file || !lf.value) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result)
      lf.value.render(data)
      syncHasNodes()
      clearSelection()
    } catch (err) { console.error('Import failed:', err) }
  }
  reader.readAsText(file)
  e.target.value = ''
}

// ─── 生命周期 ──────────────────────────────────────

let ro = null
let destroyed = false

onMounted(() => {
  ro = new ResizeObserver(() => {
    if (destroyed) return
    if (!lf.value && containerRef.value?.clientWidth > 0) initLogicFlow()
    else if (lf.value && containerRef.value) lf.value.resize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  })
  containerRef.value && ro.observe(containerRef.value)
})

onUnmounted(() => {
  destroyed = true
  ro?.disconnect()
  ro = null
  try { lf.value?.destroy() } catch {}
  lf.value = null
})
</script>

<style scoped>
/* ═══ 布局 ════════════════════════════════════════ */
.ffc {
  display: flex; flex-direction: column; height: 100vh;
  background: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  font-size: 13px; color: #1e293b;
}
.ffc-body { display: flex; flex: 1; overflow: hidden; min-height: 0; }

/* ═══ 面板 Header ════════════════════════════════ */
.panel-hd {
  height: 44px; display: flex; align-items: center; gap: 8px;
  padding: 0 14px; border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0; background: #fff;
}
.panel-hd-title { font-size: 12.5px; font-weight: 700; color: #374151; }
.panel-hd-tabs { display: flex; gap: 2px; margin-left: auto; background: #f1f5f9; border-radius: 6px; padding: 2px; }
.hd-tab { padding: 3px 10px; font-size: 11.5px; font-weight: 500; color: #64748b; background: transparent; border: none; border-radius: 4px; cursor: pointer; transition: all .12s; }
.hd-tab.active { background: #fff; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.badge { margin-left: auto; font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 20px; }
.badge-node  { background: #eff6ff; color: #3b82f6; }
.badge-edge  { background: #fefce8; color: #b45309; }
.badge-multi { background: #f0fdf4; color: #16a34a; }

/* ═══ 左侧图形库 ═══════════════════════════════════ */
.ffc-sidebar { width: 192px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }
.sidebar-body { flex: 1; overflow-y: auto; padding: 10px 8px 20px; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
.shape-group { margin-bottom: 16px; }
.shape-group-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; padding: 0 4px; margin-bottom: 7px; }
.shape-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.shape-card {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 4px 6px; background: #fafafa; border: 1px solid #e2e8f0;
  border-radius: 8px; cursor: grab; transition: all .15s; user-select: none;
}
.shape-card:hover { background: #f0f9ff; border-color: #93c5fd; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(59,130,246,.1); }
.shape-card:active { cursor: grabbing; transform: scale(.97); box-shadow: none; }
.shape-svg-wrap { width: 40px; height: 32px; display: flex; align-items: center; justify-content: center; }
.shape-card-name { font-size: 10.5px; color: #64748b; font-weight: 500; }

/* 线型选项 */
.edge-type-list { display: flex; flex-direction: column; gap: 5px; }
.edge-type-card {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: 1px solid #e2e8f0; border-radius: 7px; cursor: pointer;
  background: #fafafa; font-size: 12px; color: #64748b; transition: all .12s;
}
.edge-type-card:hover { background: #f0f9ff; border-color: #93c5fd; }
.edge-type-card.active { background: #eff6ff; border-color: #3b82f6; color: #2563eb; font-weight: 600; }
.edge-type-svg { width: 60px; height: 20px; flex-shrink: 0; color: #6b7280; }
.edge-type-card.active .edge-type-svg { color: #3b82f6; }

.sidebar-tip { display: flex; align-items: flex-start; gap: 5px; padding: 8px 9px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 7px; font-size: 11px; color: #94a3b8; line-height: 1.5; margin-top: 4px; }
.sidebar-tip svg { flex-shrink: 0; margin-top: 1px; }

/* ═══ 工具栏 ═══════════════════════════════════════ */
.ffc-canvas-area { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
.toolbar { height: 46px; background: #fff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 10px; gap: 1px; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.toolbar-group { display: flex; align-items: center; }
.tbtn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; border-radius: 6px; cursor: pointer; color: #64748b; transition: all .12s; flex-shrink: 0; }
.tbtn svg { width: 15px; height: 15px; }
.tbtn:hover:not(:disabled) { background: #f1f5f9; color: #1e293b; }
.tbtn:disabled { opacity: .3; cursor: not-allowed; }
.tbtn.tbtn-active { background: #eff6ff; color: #2563eb; }
.tbtn.tbtn-danger:hover:not(:disabled) { background: #fef2f2; color: #dc2626; }
.tbtn-sep { width: 1px; height: 18px; background: #e2e8f0; margin: 0 5px; flex-shrink: 0; }
.zoom-badge { height: 30px; min-width: 40px; padding: 0 4px; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 500; color: #64748b; background: transparent; border: none; border-radius: 6px; cursor: pointer; transition: all .12s; font-variant-numeric: tabular-nums; }
.zoom-badge:hover { background: #f1f5f9; color: #1e293b; }
.tbtn-export { display: flex; align-items: center; gap: 5px; padding: 5px 12px; background: linear-gradient(135deg,#1e293b,#334155); color: #fff; border: none; border-radius: 7px; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .15s; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,.15); }
.tbtn-export:hover { background: linear-gradient(135deg,#0f172a,#1e293b); }
.tbtn-export svg { width: 13px; height: 13px; }
.flex-1 { flex: 1; }

/* ═══ 画布 ════════════════════════════════════════ */
.canvas-box { flex: 1; position: relative; overflow: hidden; min-width: 0; min-height: 0; transition: background .25s; }

/* dot：浅灰底 + CSS 点阵 */
.canvas-box.bg-dot {
  background-color: #f8fafc;
  background-image: radial-gradient(circle, #c8d3e0 1px, transparent 1px);
  background-size: 20px 20px;
}
/* grid：CSS 网格线 */
.canvas-box.bg-grid {
  background-color: #f8fafc;
  background-image:
    linear-gradient(rgba(100,116,139,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100,116,139,.12) 1px, transparent 1px);
  background-size: 24px 24px;
}
/* plain：渐变纯色 */
.canvas-box.bg-plain { background: linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#fff7ed 100%); }

.canvas-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.canvas-empty-inner { text-align: center; }
.canvas-empty-inner svg { margin: 0 auto 10px; display: block; color: #cbd5e1; }
.canvas-empty-inner p { font-size: 13px; font-weight: 500; color: #94a3b8; margin: 0; }
.fade-enter-active,.fade-leave-active { transition: opacity .3s; }
.fade-enter-from,.fade-leave-to { opacity: 0; }

/* ═══ 属性面板 ════════════════════════════════════ */
.ffc-props { width: 252px; background: #fff; border-left: 1px solid #e2e8f0; display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }
.props-body { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }

/* 属性区块 */
.ps { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; }
.ps-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 9px; }
.pr { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.pr:last-child { margin-bottom: 0; }
.pl { width: 36px; flex-shrink: 0; font-size: 11.5px; color: #64748b; line-height: 28px; }
.pi { flex: 1; padding: 5px 8px; font-size: 12.5px; border: 1px solid #e2e8f0; border-radius: 6px; outline: none; background: #fafafa; color: #1e293b; box-sizing: border-box; transition: border-color .12s, box-shadow .12s; min-width: 0; }
.pi:focus { border-color: #93c5fd; background: #fff; box-shadow: 0 0 0 3px rgba(147,197,253,.15); }
.pi-sm { width: 56px; flex: none; }
.pi-row { display: flex; align-items: center; gap: 5px; }
.pu { font-size: 11px; color: #94a3b8; }
.p2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.p2col > div { display: flex; flex-direction: column; gap: 3px; }
.p2col .pl { line-height: normal; font-size: 11px; color: #94a3b8; }

/* ColorRow (:deep) */
:deep(.color-row-wrap) { flex: 1; min-width: 0; }
:deep(.cr-display) { display: flex; align-items: center; gap: 7px; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; background: #fafafa; margin-bottom: 6px; transition: border-color .12s; }
:deep(.cr-display:hover) { border-color: #93c5fd; }
:deep(.cr-dot) { width: 18px; height: 18px; border-radius: 3px; flex-shrink: 0; }
:deep(.cr-hex) { font-size: 11.5px; color: #64748b; font-family: 'SF Mono','Menlo',monospace; text-transform: uppercase; }
:deep(.cr-swatches) { display: grid; grid-template-columns: repeat(10,1fr); gap: 3px; }
:deep(.crs) { width: 17px; height: 17px; border-radius: 3px; border: 2px solid transparent; cursor: pointer; transition: transform .1s, border-color .1s; box-sizing: border-box; }
:deep(.crs:hover) { transform: scale(1.2); }
:deep(.crs.active) { border-color: #1e293b; transform: scale(1.1); }

/* 形状切换 */
.shape-type-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 5px; }
.stbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 7px 3px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fafafa; cursor: pointer; color: #94a3b8; font-size: 10.5px; transition: all .12s; }
.stbtn:hover { background: #f0f9ff; border-color: #93c5fd; color: #2563eb; }
.stbtn.active { background: #eff6ff; border-color: #3b82f6; color: #2563eb; font-weight: 600; }

/* 分段控制 */
.seg-ctrl { display: flex; background: #f1f5f9; border-radius: 6px; padding: 2px; gap: 1px; flex: 1; }
.seg-btn { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px 2px; border: none; border-radius: 4px; background: transparent; cursor: pointer; transition: all .1s; }
.seg-btn:hover { background: #e2e8f0; }
.seg-btn.active { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.seg-text { font-size: 12px; font-weight: 500; color: #64748b; }
.seg-text.active { color: #2563eb; }

/* 操作按钮 */
.action-group { display: flex; flex-direction: column; gap: 5px; }
.abtn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 7px; font-size: 12.5px; font-weight: 500; border: 1px solid #e2e8f0; border-radius: 7px; background: #fafafa; color: #374151; cursor: pointer; transition: all .12s; }
.abtn:hover { background: #f1f5f9; border-color: #cbd5e1; }
.abtn.abtn-danger { color: #dc2626; background: #fef2f2; border-color: #fecaca; }
.abtn.abtn-danger:hover { background: #fee2e2; border-color: #fca5a5; }

/* 空状态 */
.props-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 20px; text-align: center; }
.props-empty-icon { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg,#eff6ff,#f8fafc); display: flex; align-items: center; justify-content: center; color: #93c5fd; margin-bottom: 14px; border: 1px solid #e0f2fe; }
.props-empty p { font-size: 13px; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.props-empty .hint { font-size: 12px; color: #94a3b8; margin: 0; }

.hidden-input { position: fixed; width: 0; height: 0; opacity: 0; pointer-events: none; top: -999px; }
</style>

<style>
/* LogicFlow 容器全透明，由外层 .canvas-box CSS class 控制背景 */
.canvas-box .lf-graph { background: transparent !important; width: 100%; height: 100%; }
.canvas-box svg.lf-canvas-overlay { background: transparent !important; }
/* 隐藏 LF 内置的 grid SVG，改由 CSS 背景实现 */
.canvas-box .lf-grid { display: none !important; }
/* 对齐线 */
.canvas-box .lf-snapline { stroke: #3b82f6 !important; stroke-width: 1px !important; opacity: .7; }
</style>
