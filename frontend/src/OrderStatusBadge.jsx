function OrderStatusBadge({ status }) {
    let badgeClass = "";

    switch (status) {
        case "Pending Approval":
            badgeClass = "badge bg-warning text-dark";
            break;

        case "Approved":
            badgeClass = "badge bg-primary";
            break;

        case "Ordered":
            badgeClass = "badge bg-info";
            break;

        case "Delivered":
            badgeClass = "badge bg-success";
            break;

        default:
            badgeClass = "badge bg-secondary";
    }

    return (
        <span className={badgeClass}>
            {status}
        </span>
    );
}

export default OrderStatusBadge;