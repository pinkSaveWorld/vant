import { createNamespace } from '../utils';
import { useParent } from '@vant/use';
import { useRoute, routeProps } from '../composables/use-route';
import { SIDEBAR_KEY, SidebarProvide } from '../sidebar';
import Badge from '../badge';

const [createComponent, bem] = createNamespace('sidebar-item');

export default createComponent({
  props: {
    ...routeProps,
    dot: Boolean,
    title: String,
    badge: [Number, String],
    disabled: Boolean,
  },

  emits: ['click'],

  setup(props, { emit, slots }) {
    const route = useRoute();
    const { parent, index } = useParent<SidebarProvide>(SIDEBAR_KEY);

    if (!parent) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          '[Vant] <SidebarItem> must be a child component of <Sidebar>.'
        );
      }
      return;
    }

    const onClick = () => {
      if (props.disabled) {
        return;
      }

      emit('click', index.value);
      parent.setActive(index.value);
      route();
    };

    return () => {
      const { dot, badge, title, disabled } = props;
      const selected = index.value === parent.getActive();

      return (
        <a class={bem({ select: selected, disabled })} onClick={onClick}>
          <Badge dot={dot} content={badge} class={bem('text')}>
            {slots.title ? slots.title() : title}
          </Badge>
        </a>
      );
    };
  },
});
