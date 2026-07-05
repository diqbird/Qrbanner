import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';
import type { useQrCreateFormActions } from '@/hooks/use-qr-create-form-actions';
import type { QrCreateFeatureSlice } from '@/lib/qr-create-feature-slice';

type CoreRest = Omit<ReturnType<typeof useQrCreateCoreState>, 'featureFields'>;
type Actions = ReturnType<typeof useQrCreateFormActions>;

export function buildQrCreateFormReturn({
  session,
  isGuest,
  coreRest,
  featureFields,
  featureSlice,
  actions,
  payloadData,
  redirectGuestToSignup,
  saveGuestDraft,
}: {
  session: { user?: unknown } | null | undefined;
  isGuest: boolean;
  coreRest: CoreRest;
  featureFields: QrFeatureFields;
  featureSlice: QrCreateFeatureSlice;
  actions: Actions;
  payloadData: () => Record<string, string>;
  redirectGuestToSignup: () => void;
  saveGuestDraft: () => void;
}) {
  return {
    session,
    isGuest,
    mode: coreRest.mode,
    setMode: coreRest.setMode,
    step: coreRest.step,
    goToStep: actions.goToStep,
    category: coreRest.category,
    name: coreRest.name,
    setName: coreRest.setName,
    qrData: coreRest.qrData,
    setQrData: coreRest.setQrData,
    style: coreRest.style,
    setStyle: coreRest.setStyle,
    undoStyle: coreRest.undo,
    redoStyle: coreRest.redo,
    canUndoStyle: coreRest.canUndo,
    canRedoStyle: coreRest.canRedo,
    logoFile: coreRest.logoFile,
    logoPreview: coreRest.logoPreview,
    storedLogoPath: coreRest.storedLogoPath,
    featureFields,
    ...featureSlice,
    activeTemplate: coreRest.activeTemplate,
    templateGuideDismissed: coreRest.templateGuideDismissed,
    setTemplateGuideDismissed: coreRest.setTemplateGuideDismissed,
    saving: coreRest.saving,
    payloadData,
    applyTemplate: actions.applyTemplate,
    selectCategory: actions.selectCategory,
    handleLogoChange: actions.handleLogoChange,
    applyTemplateLogo: actions.applyTemplateLogo,
    handleSave: actions.handleSave,
    canProceed: actions.canProceed,
    redirectGuestToSignup,
    saveGuestDraft,
    enterWizardFromQuick: actions.enterWizardFromQuick,
  };
}

export type QrCreateFormReturn = ReturnType<typeof buildQrCreateFormReturn>;
