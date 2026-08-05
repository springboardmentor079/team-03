import React from 'react';
import { useAuth } from '../context/auth';

/**
 * OrderActionButtons Component
 * Renders status transition action buttons according to user role permissions & the Four-Eyes principle.
 * 
 * Rules:
 * 1. Orders requested by a Project Manager MUST be approved by an Administrator.
 *    - If a Project Manager places an order, they have no rights to approve or reject it.
 *    - For Project Managers (or non-Admins), it displays "🔒 Waiting Admin's Approval".
 * 2. Orders requested by a Site Engineer can be approved by a Project Manager or Administrator.
 * 3. Four-Eyes Principle: Users cannot approve their own self-submitted orders.
 * 
 * @param {Object} props
 * @param {Object} props.order - Purchase order object
 * @param {Object} [props.user] - Optional user object override
 * @param {Function} props.onUpdateStatus - Callback function (orderId, newStatus) => void
 */
const OrderActionButtons = ({ order, user: userProp, onUpdateStatus }) => {
  const authContext = useAuth();
  const currentUser = userProp || authContext?.user;

  if (!order || !order.status) return null;

  const userRole = currentUser?.role || 'Site Engineer';
  const currentUserName = (currentUser?.name || currentUser?.username || '').toLowerCase();
  const isApproverRole = ['Administrator', 'Project Manager'].includes(userRole);
  const isAdmin = userRole === 'Administrator';

  // Order Creator metadata
  const orderCreator = (order.createdBy || order.requestedBy || '').toLowerCase();
  const orderCreatorRole = 
    order.createdByRole || 
    (orderCreator.includes('engineer') ? 'Site Engineer' : 
     (orderCreator.includes('manager') || orderCreator.includes('sarah') || orderCreator.includes('project') ? 'Project Manager' : 
     'Project Manager'));

  const isSelfOrder = Boolean(currentUserName && orderCreator && currentUserName === orderCreator);

  switch (order.status) {
    case 'Pending Approval':
      // 1. Hierarchy Rule: PM-created orders MUST be approved by an Admin.
      // If order was created by a Project Manager and current user is NOT an Admin:
      if (orderCreatorRole === 'Project Manager' && !isAdmin) {
        return (
          <span
            className="badge bg-warning text-dark border p-2 text-wrap shadow-sm fw-bold"
            title="Project Manager orders require Administrator approval"
            style={{ fontSize: '0.75rem' }}
          >
            🔒 Waiting Admin's Approval
          </span>
        );
      }

      // 2. Four-Eyes Principle: Cannot approve your own self-submitted order
      if (isSelfOrder) {
        return (
          <span
            className="badge bg-warning text-dark border p-2 text-wrap fw-bold"
            title="Four-Eyes Principle: Cannot approve your own order"
            style={{ fontSize: '0.75rem' }}
          >
            🔒 Self-Submitted (Awaiting 2nd Eye)
          </span>
        );
      }

      // 3. Site Engineers (non-approvers) cannot alter order status
      if (!isApproverRole) {
        return (
          <span className="badge bg-secondary p-2 text-wrap" style={{ fontSize: '0.75rem' }}>
            Awaiting Manager Review
          </span>
        );
      }

      // 4. Authorized Approver (PM approving SE order, or Admin approving PM/SE order)
      return (
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className="btn btn-success btn-sm fw-semibold"
            onClick={() => onUpdateStatus(order._id, 'Approved')}
          >
            ✓ Approve
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm fw-semibold ms-1"
            onClick={() => onUpdateStatus(order._id, 'Rejected')}
          >
            ✕ Reject
          </button>
        </div>
      );

    case 'Approved':
      return (
        <button
          type="button"
          className="btn btn-info btn-sm text-dark fw-semibold"
          onClick={() => onUpdateStatus(order._id, 'Ordered')}
        >
          Mark Ordered
        </button>
      );

    case 'Ordered':
      return (
        <button
          type="button"
          className="btn btn-primary btn-sm fw-semibold"
          onClick={() => onUpdateStatus(order._id, 'Delivered')}
        >
          Mark Delivered
        </button>
      );

    case 'Delivered':
    case 'Rejected':
    default:
      return null;
  }
};

export default OrderActionButtons;
