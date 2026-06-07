import { useRef } from 'react';
import { createPortal } from 'react-dom';
import './AlertModal.css';

function IconCheckCircle({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11.5 14.5 15.5 9.5" />
        </svg>
    );
}

function IconWarning({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
    );
}

function IconInfo({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="11" x2="12" y2="16" />
        </svg>
    );
}

function IconDeleteForever({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function IconError({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
    );
}

const TYPES = {
    success: { Icon: IconCheckCircle, colorKey: 'success', defaultTitle: 'Éxito' },
    error:   { Icon: IconWarning,     colorKey: 'error',   defaultTitle: 'Error' },
    delete:  { Icon: IconDeleteForever, colorKey: 'delete', defaultTitle: 'Eliminar registros' },
    warning: { Icon: IconWarning,     colorKey: 'warning', defaultTitle: 'Advertencia' },
    info:    { Icon: IconInfo,        colorKey: 'info',    defaultTitle: 'Información' },
};

const DELETE_TYPES = new Set(['delete']);

export default function AlertModal({
    type = 'delete',
    title,
    message,
    open,
    onClose,
    onConfirm,
    confirmLabel = 'Sí, continuar',
    cancelLabel,
}) {
    const frozen = useRef({ type, title, message });
    if (open) frozen.current = { type, title, message };
    const { type: frozenType, title: frozenTitle, message: frozenMessage } = frozen.current;

    const { Icon, colorKey, defaultTitle } = TYPES[frozenType] ?? TYPES.warning;
    const isDelete = DELETE_TYPES.has(frozenType);
    const resolvedCancelLabel = cancelLabel ?? (onConfirm ? 'Cancelar' : 'Aceptar');

    const iconSize = { width: isDelete ? 28 : 22, height: isDelete ? 28 : 22 };

    if (!open) return null;

    return createPortal(
        <div className="nm-overlay" onMouseDown={onClose}>
            <div
                className={`nm-paper nm-${colorKey}`}
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="nm-title"
            >
                {isDelete ? (
                    <div className="nm-header-center">
                        <div className={`nm-icon-box nm-icon-box--lg`}>
                            <Icon className="nm-icon" style={iconSize} />
                        </div>
                        <h2 id="nm-title" className="nm-title nm-title--center">
                            {frozenTitle ?? defaultTitle}
                        </h2>
                    </div>
                ) : (
                    <div className="nm-header-row">
                        <div className="nm-icon-box">
                            <Icon className="nm-icon" style={iconSize} />
                        </div>
                        <h2 id="nm-title" className="nm-title">
                            {frozenTitle ?? defaultTitle}
                        </h2>
                    </div>
                )}
                <div className={isDelete ? 'nm-body nm-body--centered' : 'nm-body'}>
                    <p className={`nm-message${isDelete ? ' nm-message--center' : ''}`}>
                        {frozenMessage}
                    </p>
                </div>
                <div className="nm-footer">
                    <button type="button" className="nm-btn nm-btn-cancel" onClick={onClose}>
                        {resolvedCancelLabel}
                    </button>
                    {onConfirm && (
                        <button
                            type="button"
                            className={`nm-btn nm-btn-confirm nm-confirm-${colorKey}`}
                            onClick={onConfirm}
                            autoFocus
                        >
                            {confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
