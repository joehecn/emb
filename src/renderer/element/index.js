
import '../css/style.css'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import {
  Alert,
  Aside,
  Backtop,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  DatePicker,
  Footer,
  Header,
  Icon,
  InfiniteScroll,
  Input,
  InputNumber,
  // Loading,
  Main,
  Menu,
  MenuItem,
  MessageBox,
  Notification,
  Option,
  PageHeader,
  RadioButton,
  RadioGroup,
  Row,
  Select,
  Step,
  Steps,
  Table,
  TableColumn,
  Transfer
} from 'element-ui'

Vue.use(Alert)
Vue.component(Aside.name, Aside)
Vue.component(Backtop.name, Backtop)
Vue.component(Button.name, Button)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Card.name, Card)
Vue.component(Col.name, Col)
Vue.component(Container.name, Container)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Footer.name, Footer)
Vue.component(Header.name, Header)
Vue.component(Icon.name, Icon)
Vue.use(InfiniteScroll)
Vue.component(Input.name, Input)
Vue.component(InputNumber.name, InputNumber)
// Vue.use(Loading.directive)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Option.name, Option)
Vue.component(PageHeader.name, PageHeader)
Vue.component(RadioButton.name, RadioButton)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Row.name, Row)
Vue.component(Select.name, Select)
Vue.component(Step.name, Step)
Vue.component(Steps.name, Steps)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Transfer.name, Transfer)

// Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
