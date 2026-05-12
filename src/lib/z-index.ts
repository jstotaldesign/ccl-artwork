/**
 * Central z-index scale. Never hardcode z-index — import a token from here.
 *
 * Layer ordering (low → high):
 *   content < sticky < pageOverlay < modal < modalPopover < priorityModal
 *           < priorityModalPopover < bottomBar < lockScreen < toast
 */
export const Z = {
  content: 1,
  dropdown: 10,
  sticky: 20,
  pageOverlay: 30,
  modal: 10000,
  modalPopover: 10050,
  nestedModal: 10100,
  priorityModal: 20000,
  priorityModalPopover: 20100,
  bottomBar: 30000,
  lockScreen: 40000,
  toast: 2147483647,
} as const;

export const Z_CLASS = {
  content: "z-[1]",
  dropdown: "z-[10]",
  sticky: "z-[20]",
  pageOverlay: "z-[30]",
  modal: "z-[10000]",
  modalPopover: "z-[10050]",
  nestedModal: "z-[10100]",
  priorityModal: "z-[20000]",
  priorityModalPopover: "z-[20100]",
  bottomBar: "z-[30000]",
  lockScreen: "z-[40000]",
  toast: "z-[2147483647]",
} as const;
