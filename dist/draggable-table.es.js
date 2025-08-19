import { reactive as U, ref as V, nextTick as L, defineComponent as W, computed as A, onMounted as $, resolveComponent as P, openBlock as R, createElementBlock as O, createVNode as j, mergeProps as z, unref as g, withCtx as N, Fragment as F, renderList as J, createBlock as q, createElementVNode as G, normalizeClass as H, withModifiers as Q, renderSlot as X, withDirectives as Y, withKeys as Z, vModelText as ee, toDisplayString as te } from "vue";
function le(l, C, e) {
  const t = U({
    isDragging: !1,
    startCell: null,
    dragData: [],
    isSelecting: !1,
    startSelection: null
  });
  return {
    dragState: t,
    handleDragStart: (v, E, n, r) => {
      const m = `${r}-${n.property}`;
      if (!e.value.has(m))
        return !1;
      t.isDragging = !0, t.startCell = { row: r, col: n.property }, t.dragData = Array.from(e.value).map((w) => {
        const [a, s] = w.split("-");
        return {
          row: parseInt(a),
          col: s,
          value: l.data[parseInt(a)][s]
        };
      }), v.dataTransfer.effectAllowed = "move", v.dataTransfer.setData("text/plain", JSON.stringify(t.dragData));
    },
    handleDragOver: (v) => {
      t.isDragging && (v.preventDefault(), v.dataTransfer.dropEffect = "move", v.currentTarget.classList.add("drag-over"));
    },
    handleDrop: (v, E, n, r) => {
      if (!t.isDragging || !t.dragData.length)
        return;
      v.preventDefault();
      const m = r, w = n.property;
      if (!t.startCell)
        return;
      const a = t.startCell.row, s = l.columns.findIndex((y) => y.prop === t.startCell.col), f = l.columns.findIndex((y) => y.prop === w), h = m - a, c = f - s, K = t.dragData.map((y) => {
        var o;
        const x = y.row + h, b = l.columns.findIndex((_) => _.prop === y.col) + c, M = (o = l.columns[b]) == null ? void 0 : o.prop;
        return {
          from: { row: y.row, col: y.col },
          to: { row: x, col: M },
          value: y.value
        };
      });
      C("drag-complete", K), t.isDragging = !1, t.startCell = null, t.dragData = [];
    }
  };
}
function ae(l, C) {
  const e = V({ row: -1, col: "" }), t = V(null);
  return {
    editingCell: e,
    cellInput: t,
    isEditing: (n, r) => l.editable && e.value.row === n && e.value.col === r,
    handleCellDoubleClick: (n, r, m) => {
      if (!l.editable)
        return;
      const w = n[r.property];
      return e.value = {
        row: m,
        col: r.property
      }, L(() => {
        t.value && (t.value.focus(), t.value.select());
      }), w;
    },
    finishEdit: () => {
      if (e.value.row === -1)
        return;
      const { row: n, col: r } = e.value;
      C("cell-change", {
        row: n,
        col: r,
        value: l.data[n][r],
        oldValue: l.data[n][r]
        // 实际应用中这里应该保存编辑前的值
      }), e.value = { row: -1, col: "" };
    },
    startEdit: (n, r) => {
      e.value = { row: n, col: r }, L(() => {
        t.value && (t.value.focus(), t.value.select());
      });
    },
    cancelEdit: () => {
      e.value = { row: -1, col: "" };
    }
  };
}
function oe(l, C) {
  const e = V(/* @__PURE__ */ new Set()), t = V(null), p = U({
    isSelecting: !1,
    startSelection: null
  }), S = (a, s, f, h) => {
    if (!l.selectable)
      return;
    const c = `${h}-${f.property}`;
    !a.ctrlKey && !a.metaKey && e.value.clear(), e.value.has(c) ? e.value.delete(c) : e.value.add(c), w();
  }, T = (a, s, f, h) => {
    if (!l.selectable)
      return;
    const c = `${h}-${f.property}`;
    e.value.has(c) || (p.isSelecting = !0, p.startSelection = { row: h, col: f.property }, !a.ctrlKey && !a.metaKey && e.value.clear(), e.value.add(c), w(), a.preventDefault());
  }, v = () => {
    p.isSelecting && (p.isSelecting = !1, p.startSelection = null);
  }, E = (a, s, f) => {
    !l.selectable || !p.isSelecting || !p.startSelection || (n(p.startSelection, { row: f, col: s.property }), w());
  }, n = (a, s) => {
    if (!l.columns)
      return;
    e.value.clear();
    const f = Math.min(a.row, s.row), h = Math.max(a.row, s.row), c = l.columns.findIndex((b) => b.prop === a.col), K = l.columns.findIndex((b) => b.prop === s.col), y = Math.min(c, K), x = Math.max(c, K);
    for (let b = f; b <= h; b++)
      for (let M = y; M <= x; M++) {
        const o = `${b}-${l.columns[M].prop}`;
        e.value.add(o);
      }
  }, r = () => {
    e.value.clear(), w();
  }, m = () => !l.data || !l.columns ? [] : Array.from(e.value).map((a) => {
    var h, c;
    const [s, f] = a.split("-");
    return {
      row: parseInt(s),
      col: f,
      value: ((c = (h = l.data) == null ? void 0 : h[parseInt(s)]) == null ? void 0 : c[f]) ?? void 0
    };
  }), w = () => {
    C("selection-change", new Set(e.value));
  };
  return {
    tableRef: t,
    selectedCells: e,
    handleCellClick: S,
    handleCellMouseDown: T,
    handleCellMouseUp: v,
    handleCellMouseEnter: E,
    clearSelection: r,
    getSelectedData: m,
    updateSelection: n
  };
}
const ne = { class: "draggable-table-container" }, re = ["data-row", "data-col", "draggable", "onMousedown", "onMouseup", "onDragstart", "onDragover", "onDrop", "onDblclick"], se = ["onUpdate:modelValue"], ce = { key: 1 }, de = /* @__PURE__ */ W({
  __name: "DraggableTable",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    draggable: {
      type: Boolean,
      default: !0
    },
    editable: {
      type: Boolean,
      default: !0
    },
    selectable: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["update:data", "cell-change", "drag-complete", "selection-change"],
  setup(l, { emit: C }) {
    const e = l, t = C;
    let {
      tableRef: p,
      selectedCells: S,
      handleCellClick: T,
      handleCellMouseDown: v,
      handleCellMouseUp: E,
      updateSelection: n
    } = oe(e, t), {
      editingCell: r,
      isEditing: m,
      handleCellDoubleClick: w,
      finishEdit: a,
      cellInput: s
    } = ae(e, t), {
      dragState: f,
      handleDragStart: h,
      handleDragOver: c,
      handleDrop: K
    } = le(e, t, S);
    const y = A(() => [...e.data]), x = A(() => e.columns.map((o) => typeof o != "object" || o === null ? {
      minWidth: 100
    } : {
      ...o,
      minWidth: o.minWidth || o.width || 100
    })), b = (o, _, B) => {
      const I = `${B}-${_.property}`;
      return {
        "draggable-cell": !0,
        "selected-cell": S.value.has(I),
        "drag-over": !1
      };
    }, M = (o) => {
      (o.key === "Delete" || o.key === "Backspace") && S.value.forEach((_) => {
        const [B, I] = _.split("-"), k = parseInt(B), d = e.data[k];
        typeof d == "object" && d !== null && I in d && t("cell-change", {
          row: k,
          col: I,
          value: "",
          oldValue: d[I]
        });
      });
    };
    return $(() => {
      document.addEventListener("keydown", M);
    }), (o, _) => {
      const B = P("el-table-column"), I = P("el-table");
      return R(), O("div", ne, [
        j(I, z({
          ref_key: "tableRef",
          ref: p,
          data: y.value,
          style: { width: "100%" }
        }, o.$attrs, {
          onCellClick: g(T),
          onCellMouseEnter: o.handleCellMouseEnter,
          onCellMouseLeave: o.handleCellMouseLeave
        }), {
          default: N(() => [
            (R(!0), O(F, null, J(x.value, (k) => (R(), q(B, {
              key: k.prop,
              prop: k.prop,
              label: k.label,
              width: k.width,
              "min-width": k.minWidth
            }, {
              default: N(({ row: d, column: u, $index: D }) => [
                G("div", {
                  class: H(b(d, u, D)),
                  "data-row": D,
                  "data-col": u.property,
                  draggable: g(S).has(`${D}-${u.property}`),
                  onMousedown: (i) => g(v)(i, d, u, D),
                  onMouseup: (i) => g(E)(i, d, u, D),
                  onDragstart: (i) => g(h)(i, d, u, D),
                  onDragover: Q((i) => g(c)(i, d, u, D), ["prevent"]),
                  onDrop: (i) => g(K)(i, d, u, D),
                  onDblclick: (i) => g(w)(d, u, D)
                }, [
                  X(o.$slots, "cell", {
                    row: d,
                    column: u,
                    index: D,
                    editing: g(m)(D, u.property)
                  }, () => [
                    g(m)(D, u.property) ? Y((R(), O("input", {
                      key: 0,
                      "onUpdate:modelValue": (i) => d[u.property] = i,
                      onBlur: _[0] || (_[0] = //@ts-ignore
                      (...i) => g(a) && g(a)(...i)),
                      onKeyup: _[1] || (_[1] = Z(
                        //@ts-ignore
                        (...i) => g(a) && g(a)(...i),
                        ["enter"]
                      )),
                      class: "cell-input",
                      ref_for: !0,
                      ref_key: "cellInput",
                      ref: s
                    }, null, 40, se)), [
                      [ee, d[u.property]]
                    ]) : (R(), O("span", ce, te(d[u.property] || ""), 1))
                  ], !0)
                ], 42, re)
              ]),
              _: 2
            }, 1032, ["prop", "label", "width", "min-width"]))), 128))
          ]),
          _: 3
        }, 16, ["data", "onCellClick", "onCellMouseEnter", "onCellMouseLeave"])
      ]);
    };
  }
});
const ie = (l, C) => {
  const e = l.__vccOpts || l;
  for (const [t, p] of C)
    e[t] = p;
  return e;
}, ue = /* @__PURE__ */ ie(de, [["__scopeId", "data-v-2748507b"]]);
const fe = {
  install(l, C = {}) {
    l.component(C.componentName || "DraggableTable", ue), C.globalStyles !== !1 && import("./index-9ce01ed3.mjs");
  }
};
export {
  ue as DraggableTable,
  fe as default
};
