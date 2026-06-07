const HTTP_MESSAGES = {
    400: 'Solicitud inválida',
    401: 'No cuentas con los permisos necesarios',
    403: 'Acceso denegado',
    404: 'Recurso no encontrado',
    500: 'Error interno del servidor',
};

export function httpErrorMessage(status) {
    return HTTP_MESSAGES[status] ?? `Error: ${status}`;
}
